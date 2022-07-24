const { ethers, network } = require("hardhat");
const { expect } = require("chai");
const { smock } = require("@defi-wonderland/smock");
const { formatEther } = require("ethers/lib/utils");

describe("Callable Bond Depository", async () => {

    const mulDiv = (val, mul, div) => {
        return ethers.BigNumber.from(val).mul(ethers.BigNumber.from(Math.round(mul * 1000000))).div(Math.round(div * 1000000))
    }
    const LARGE_APPROVAL = "100000000000000000000000000000000";
    // Initial mint for Frax, req and DAI (10,000,000)
    const initialMint = "10000000000000000000000000";
    const initialDeposit = "1000000000000000000000000";

    const maxSupply = "1000000000000000000000000000000000"
    const one18 = ethers.BigNumber.from(10).pow(18)
    // Increase timestamp by amount determined by `offset`

    let deployer, alice, bob, carol;
    let erc20Factory;
    let mockReqFactory;
    let authFactory;
    let depositoryFactory;
    let mockOracleFactory;

    let auth;
    let dai;
    let req;
    let depository;
    let treasury;

    let capacity = ethers.BigNumber.from(10000).mul(one18);
    let initialPrice = ethers.BigNumber.from(400).mul(one18);
    let buffer = 2e5;

    // option params
    let maxPayoffPercentage = one18.div(10) // 10%
    let strike = one18.div(20) // 5%

    let vesting = 100;
    let timeToConclusion = 60 * 60 * 24;
    let conclusion;

    let depositInterval = 60 * 60 * 4;
    let tuneInterval = 60 * 60;

    let refReward = 10;
    let daoReward = 50;

    var bid = 0;

    let market;
    let terms;
    let userTerm;
    let metadata
    let adjustment

    /**
     * Everything in this block is only run once before all tests.
     * This is the home for setup methods
     */
    before(async () => {
        [deployer, alice, bob, carol] = await ethers.getSigners();

        authFactory = await ethers.getContractFactory("Authority");
        erc20Factory = await smock.mock("MockERC20");
        mockReqFactory = await smock.mock("MockREQ");
        mockOracleFactory = await smock.mock("MockOracleOasis")

        depositoryFactory = await ethers.getContractFactory("CallableBondDepositoryOasis");

    });

    beforeEach(async () => {

        const block = await ethers.provider.getBlock("latest");
        conclusion = block.timestamp + timeToConclusion;

        dai = await erc20Factory.deploy("Dai", "DAI", 18);

        auth = await authFactory.deploy(
            deployer.address,
            deployer.address,
            deployer.address,
            deployer.address
        );
        req = await mockReqFactory.deploy(maxSupply);
        treasury = await smock.fake("ITreasuryAuth");

        mockOracle = await mockOracleFactory.deploy()
        await mockOracle.setPrice(one18)

        depository = await depositoryFactory.deploy(
            req.address,
            treasury.address,
            mockOracle.address
        );


        // Setup for each component
        await dai.mint(bob.address, initialMint);

        // To get past req contract guards
        await auth.pushVault(treasury.address, true);

        await dai.mint(deployer.address, initialDeposit);
        await dai.approve(treasury.address, initialDeposit);
        //await treasury.deposit(initialDeposit, dai.address, "10000000000000");

        await req.setMinter(deployer.address, LARGE_APPROVAL)
        await req.setMinter(treasury.address, LARGE_APPROVAL)

        await req.mint(deployer.address, one18.mul(10000));
        await req.mint(depository.address, one18.mul(10000));

        await treasury.baseSupply.returns(await req.totalSupply());
        // await treasury.assetValue.whenCalledWith([dai.address, "10000000000000000000000"]).returns("10000000000000000000000")
        await treasury.governor.returns(deployer.address);
        await treasury.vault.returns(deployer.address);
        await treasury.guardian.returns(deployer.address);
        await treasury.policy.returns(deployer.address);


        await req.connect(alice).approve(depository.address, LARGE_APPROVAL);
        await dai.connect(bob).approve(depository.address, LARGE_APPROVAL);

        await depository.setRewards(refReward, daoReward);
        await depository.whitelist(carol.address);

        await dai.connect(alice).approve(depository.address, capacity);

        // create the first bond
        await depository.create(
            dai.address,
            ["",""],
            [capacity, initialPrice, buffer, strike, maxPayoffPercentage],
            [false, true],
            [vesting, conclusion],
            [depositInterval, tuneInterval]
        );
    });

    it("should create market", async () => {
        expect(await depository.isLive(bid)).to.equal(true);
    });

    it("should conclude in correct amount of time", async () => {
        terms = await depository.terms(bid);
        expect(terms.conclusion).to.equal(conclusion);
        metadata = await depository.metadata(bid);
        // timestamps are a bit inaccurate with tests
        var upperBound = mulDiv(timeToConclusion, 1.0033, 1).toString();
        var lowerBound = mulDiv(timeToConclusion, 0.9967, 1).toString();

        // _length required as length is used for array length
        expect(Number(metadata._length)).to.be.greaterThan(Number(lowerBound));
        expect(Number(metadata._length)).to.be.lessThan(Number(upperBound));
    });

    it("should set max payout to correct % of capacity", async () => {
        market = await depository.markets(bid);
        var upperBound = mulDiv(capacity, 1.0033, 6);
        var lowerBound = mulDiv(capacity, 0.9967, 6);
        expect(market.maxPayout.gt(lowerBound)).to.be.equal(true);
        expect(market.maxPayout.lt(upperBound)).to.be.equal(true);
    });

    it("should return IDs of all markets", async () => {
        // create a second bond
        await depository.create(
            dai.address,
            ["",""],
            [capacity, initialPrice, buffer, strike, maxPayoffPercentage],
            [false, true],
            [vesting, conclusion],
            [depositInterval, tuneInterval]
        );
        let [first, second] = await depository.liveMarkets();
        expect(Number(first)).to.equal(0);
        expect(Number(second)).to.equal(1);
    });

    it("should update IDs of markets", async () => {
        // create a second bond
        await depository.create(
            dai.address,
            ["",""],
            [capacity, initialPrice, buffer, strike, maxPayoffPercentage],
            [false, true],
            [vesting, conclusion],
            [depositInterval, tuneInterval]
        );
        // close the first bond
        await depository.close(0);
        [first] = await depository.liveMarkets();
        expect(Number(first)).to.equal(1);
    });

    it("should include ID in live markets for quote token", async () => {
        [id] = await depository.liveMarketsFor(dai.address);
        expect(Number(id)).to.equal(bid);
    });

    it("should start with price at initial price", async () => {
        let lowerBound = initialPrice * 0.9999;
        expect(Number(await depository.marketPrice(bid))).to.be.greaterThan(lowerBound);
    });

    it("should give accurate payout for price", async () => {
        let price = await depository.marketPrice(bid);
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        let expectedPayout = amount / price;
        let lowerBound = mulDiv(expectedPayout, 0.9999, 1);
        const payout = await depository.payoutFor(amount, 0)
        expect(payout.gt(lowerBound)).to.be.equal(true);
    });

    it("should decay debt", async () => {
        market = await depository.markets(0);

        await network.provider.send("evm_increaseTime", [100]);
        await depository.connect(bob).deposit(bid, "0", initialPrice, bob.address, carol.address);

        let newMarket = await depository.markets(0);
        expect(Number(market.totalDebt)).to.be.greaterThan(Number(newMarket.totalDebt));
    });

    it("should not start adjustment if ahead of schedule", async () => {
        let amount = "650000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice.mul(2), bob.address, carol.address);
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice.mul(2), bob.address, carol.address);

        await network.provider.send("evm_increaseTime", [tuneInterval]);
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice.mul(2), bob.address, carol.address);
        adjustment = await depository.adjustments(bid);
        expect(adjustment.active).to.equal(false);
    });

    it("should start adjustment if behind schedule", async () => {
        await network.provider.send("evm_increaseTime", [tuneInterval]);
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);
        adjustment = await depository.adjustments(bid);
        expect(adjustment.active).to.equal(true);
    });

    it("adjustment should lower control variable by change in tune interval if behind", async () => {
        await network.provider.send("evm_increaseTime", [tuneInterval]);
        terms = await depository.terms(bid);
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);
        await network.provider.send("evm_increaseTime", [tuneInterval]);
        adjustment = await depository.adjustments(bid);
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);
        let newTerms = await depository.terms(bid);
        expect(newTerms.controlVariable).to.equal(terms.controlVariable.sub(adjustment.change));
    });

    it("adjustment should lower control variable by half of change in half of a tune interval", async () => {
        await network.provider.send("evm_increaseTime", [tuneInterval]);
        terms = await depository.terms(bid);
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);
        adjustment = await depository.adjustments(bid);
        await network.provider.send("evm_increaseTime", [tuneInterval / 2]);
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);
        let newTerms = await depository.terms(bid);
        let lowerBound = (terms.controlVariable - adjustment.change / 2) * 0.999;
        expect(Number(newTerms.controlVariable)).to.lessThanOrEqual(
            Number(terms.controlVariable.sub(adjustment.change.div(2)))
        );
        expect(Number(newTerms.controlVariable)).to.greaterThan(Number(lowerBound));
    });

    it("adjustment should continue lowering over multiple deposits in same tune interval", async () => {
        await network.provider.send("evm_increaseTime", [tuneInterval]);
        terms = await depository.terms(bid);
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);
        adjustment = await depository.adjustments(bid);

        await network.provider.send("evm_increaseTime", [tuneInterval / 2]);
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);

        await network.provider.send("evm_increaseTime", [tuneInterval / 2]);
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);
        let newTerms = await depository.terms(bid);
        expect(newTerms.controlVariable).to.equal(terms.controlVariable.sub(adjustment.change));
    });

    it("should allow a deposit", async () => {
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);

        expect(Array(await depository.indexesFor(bob.address)).length).to.equal(1);
    });

    it("should not allow a deposit greater than max payout", async () => {
        let amount = "6700000000000000000000000"; // 6.7m (400 * 10000 / 6 + 0.5%)
        await treasury.assetValue.returns(amount)
        await expect(
            depository.connect(bob).deposit(bid, amount, initialPrice, bob.address, carol.address)
        ).to.be.revertedWith("Depository: max size exceeded");
    });

    it("should give correct rewards to referrer and dao", async () => {
        let daoBalance = await req.balanceOf(deployer.address);
        let refBalance = await req.balanceOf(carol.address);
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)
        let [payout, expiry, index] = await depository
            .connect(bob)
            .callStatic.deposit(bid, amount, initialPrice, bob.address, carol.address);
        await depository
            .connect(bob)
            .deposit(bid, amount, initialPrice, bob.address, carol.address);

        // Mint ohm for depository to payout reward
        await req.mint(depository.address, "1000000000000000000000");

        let daoExpected = Number(daoBalance) + Number((Number(payout) * daoReward) / 1e4);
        await depository.getReward();

        const frontendReward = Number(await req.balanceOf(deployer.address));
        expect(frontendReward).to.be.greaterThan(Number(daoExpected));
        expect(frontendReward).to.be.lessThan(Number(daoExpected) * 1.0001);

        let refExpected = Number(refBalance) + Number((Number(payout) * refReward) / 1e4);
        await depository.connect(carol).getReward();

        const carolReward = Number(await req.balanceOf(carol.address));
        expect(carolReward).to.be.greaterThan(Number(refExpected));
        expect(carolReward).to.be.lessThan(Number(refExpected) * 1.0001);
    });

    it("should decay a max payout in target deposit interval", async () => {
        market = await depository.markets(bid);
        let price = await depository.marketPrice(bid);
        let amount = market.maxPayout.mul(price).div(one18);
        await depository.connect(bob).deposit(
            bid,
            amount, // amount for max payout
            initialPrice,
            bob.address,
            carol.address
        );
        await network.provider.send("evm_increaseTime", [depositInterval]);
        let newPrice = await depository.marketPrice(bid);
        expect(newPrice.lt(initialPrice)).to.equal(true);
    });

    it("should provide no option payout when matured", async () => {
        // define oracleprices
        let underlyingPrice = one18
        await mockOracle.setPrice(underlyingPrice)

        // set amount and valuation
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)

        // deposit
        await depository.connect(bob).deposit(
            bid,
            amount, // amount for max payout
            initialPrice,
            bob.address,
            carol.address
        );

        // increase time
        await network.provider.send("evm_increaseTime", [vesting]);

        // set oracle price
        let newUnderlyingPrice = one18.mul(109).div(100)
        await mockOracle.setPrice(newUnderlyingPrice)

        // fetch payout data
        userTerm = await depository.userTerms(bob.address, bid);

        // call
        await depository.connect(bob).call(bob.address, [0])

        let balance = await req.balanceOf(bob.address)
        // expect balance plus option payoff
        expect(balance).to.equal(userTerm.payout);
    });

    it("should allow early exercise", async () => {
        // define oracleprices
        let underlyingPrice = one18
        await mockOracle.setPrice(underlyingPrice)

        // set amount and valuation
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)

        // deposit
        await depository.connect(bob).deposit(
            bid,
            amount, // amount for max payout
            initialPrice,
            bob.address,
            carol.address
        );

        // increase time
        await network.provider.send("evm_increaseTime", [vesting / 2]);

        // set oracle price
        let newUnderlyingPrice = one18.mul(109).div(100)
        await mockOracle.setPrice(newUnderlyingPrice)

        // fetch payout data
        userTerm = await depository.userTerms(bob.address, bid);

        let optionPayoff = await depository.optionPayoutFor(bob.address, 0)

        // call
        await depository.connect(bob).call(bob.address, [0])

        // calculate chek parameters manually
        let strikePrice = underlyingPrice.mul(strike.add(one18)).div(one18)
        let manualOptionPayoff = newUnderlyingPrice.sub(strikePrice).mul(one18).div(underlyingPrice)

        // acutal obtained opetion percentage (rounding up)
        let optionPercent = optionPayoff.mul(one18).div(userTerm.payout).add(1)

        // check that the payout percentage matches the expectation
        expect(optionPercent).to.equal(manualOptionPayoff)

        let balance = await req.balanceOf(bob.address)
        // expect balance plus option payoff
        expect(balance).to.equal(optionPayoff.add(userTerm.payout));
    });


    it("should provide no option payout after exercise period", async () => {
        // define oracleprices
        let underlyingPrice = one18
        await mockOracle.setPrice(underlyingPrice)

        // set amount and valuation
        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)

        // deposit
        await depository.connect(bob).deposit(
            bid,
            amount, // amount for max payout
            initialPrice,
            bob.address,
            carol.address
        );


        // increase time
        await network.provider.send("evm_increaseTime", [vesting]);

        // set oracle price such that exercise woul be possible if in time
        let newUnderlyingPrice = one18.mul(109).div(100)
        await mockOracle.setPrice(newUnderlyingPrice)

        // increase time so that exercising should not be possible anymore
        await network.provider.send("evm_increaseTime", [5]);


        // fetch payout data
        userTerm = await depository.userTerms(bob.address, bid);

        // call
        await depository.connect(bob).call(bob.address, [0])

        let balance = await req.balanceOf(bob.address)
        
        // expect balance to match payout
        expect(balance).to.equal(userTerm.payout);
    });

    it("should provide no option payout below threshold", async () => {
        // define oracleprices
        let underlyingPrice = one18
        await mockOracle.setPrice(underlyingPrice)

        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)

        await depository.connect(bob).deposit(
            bid,
            amount, // amount for max payout
            initialPrice,
            bob.address,
            carol.address
        );

        // increase time
        await network.provider.send("evm_increaseTime", [vesting]);

        // set oracle price
        let newUnderlyingPrice = one18.mul(95).div(100)
        await mockOracle.setPrice(newUnderlyingPrice)

        userTerm = await depository.userTerms(bob.address, bid);

        let optionPayoff = await depository.optionPayoutFor(bob.address, 0)

        // call
        await depository.connect(bob).call(bob.address, [0])

        // option value is zero
        expect(optionPayoff).to.equal(ethers.constants.Zero)

        let balance = await req.balanceOf(bob.address)

        // expect balance to be payout - no option exercise 
        expect(balance).to.equal(userTerm.payout);
    });

    it("should provide capped option payout", async () => {
        // define oracleprices
        let underlyingPrice = one18
        await mockOracle.setPrice(underlyingPrice)

        let amount = "10000000000000000000000"; // 10,000
        await treasury.assetValue.returns(amount)

        await depository.connect(bob).deposit(
            bid,
            amount, // amount for max payout
            initialPrice,
            bob.address,
            carol.address
        );

        // increase time
        await network.provider.send("evm_increaseTime", [vesting * 0.75]);

        // set oracle price
        let newUnderlyingPrice = one18.mul(130).div(100)
        await mockOracle.setPrice(newUnderlyingPrice)

        userTerm = await depository.userTerms(bob.address, bid);

        let optionPayoff = await depository.optionPayoutFor(bob.address, 0)
        // call
        await depository.connect(bob).call(bob.address, [0])

        // check that the percentage paid out is the maximum one
        expect(optionPayoff).to.equal(userTerm.payout.mul(maxPayoffPercentage).div(one18))

        let balance = await req.balanceOf(bob.address)

        // expect balanc plus option payoff
        expect(balance).to.equal(optionPayoff.add(userTerm.payout));
    });

    it("should close a market", async () => {
        [capacity, , , , , ,] = await depository.markets(bid);
        expect(Number(capacity)).to.be.greaterThan(0);
        await depository.close(bid);
        [capacity, , , , , ,] = await depository.markets(bid);
        expect(Number(capacity)).to.equal(0);
    });

    // FIXME Works in isolation but not when run in suite
    it.skip("should not allow deposit past conclusion", async () => {
        await network.provider.send("evm_increaseTime", [timeToConclusion * 10000]);
        await expect(
            depository.connect(bob).deposit(bid, 0, initialPrice, bob.address, carol.address)
        ).to.be.revertedWith("Depository: market concluded");
    });
});

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface BondDepositoryInterface extends ethers.utils.Interface {
  functions: {
    "adjustments(uint256)": FunctionFragment;
    "authority()": FunctionFragment;
    "close(uint256)": FunctionFragment;
    "create(address,uint256[3],bool[2],uint256[2],uint32[2])": FunctionFragment;
    "currentControlVariable(uint256)": FunctionFragment;
    "currentDebt(uint256)": FunctionFragment;
    "daoReward()": FunctionFragment;
    "debtDecay(uint256)": FunctionFragment;
    "debtRatio(uint256)": FunctionFragment;
    "deposit(uint256,uint256,uint256,address,address)": FunctionFragment;
    "getReward()": FunctionFragment;
    "indexesFor(address)": FunctionFragment;
    "isLive(uint256)": FunctionFragment;
    "liveMarkets()": FunctionFragment;
    "liveMarketsFor(address)": FunctionFragment;
    "marketPrice(uint256)": FunctionFragment;
    "markets(uint256)": FunctionFragment;
    "marketsForQuote(address,uint256)": FunctionFragment;
    "metadata(uint256)": FunctionFragment;
    "payoutFor(uint256,uint256)": FunctionFragment;
    "pendingFor(address,uint256)": FunctionFragment;
    "pullTerms(address,uint256)": FunctionFragment;
    "pushTerms(address,uint256)": FunctionFragment;
    "redeem(address,uint256[])": FunctionFragment;
    "redeemAll(address)": FunctionFragment;
    "refReward()": FunctionFragment;
    "req()": FunctionFragment;
    "rewards(address)": FunctionFragment;
    "setAuthority(address)": FunctionFragment;
    "setRewards(uint256,uint256)": FunctionFragment;
    "terms(uint256)": FunctionFragment;
    "updateTreasury()": FunctionFragment;
    "userTerms(address,uint256)": FunctionFragment;
    "whitelist(address)": FunctionFragment;
    "whitelisted(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "adjustments",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "authority", values?: undefined): string;
  encodeFunctionData(functionFragment: "close", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "create",
    values: [
      string,
      [BigNumberish, BigNumberish, BigNumberish],
      [boolean, boolean],
      [BigNumberish, BigNumberish],
      [BigNumberish, BigNumberish]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "currentControlVariable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "currentDebt",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "daoReward", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "debtDecay",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "debtRatio",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
  encodeFunctionData(functionFragment: "indexesFor", values: [string]): string;
  encodeFunctionData(
    functionFragment: "isLive",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "liveMarkets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "liveMarketsFor",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "marketPrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "markets",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "marketsForQuote",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "metadata",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "payoutFor",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pendingFor",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pullTerms",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pushTerms",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [string, BigNumberish[]]
  ): string;
  encodeFunctionData(functionFragment: "redeemAll", values: [string]): string;
  encodeFunctionData(functionFragment: "refReward", values?: undefined): string;
  encodeFunctionData(functionFragment: "req", values?: undefined): string;
  encodeFunctionData(functionFragment: "rewards", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setAuthority",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setRewards",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "terms", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "updateTreasury",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "userTerms",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "whitelist", values: [string]): string;
  encodeFunctionData(functionFragment: "whitelisted", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "adjustments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "authority", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "close", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "currentControlVariable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "currentDebt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "daoReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "debtDecay", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "debtRatio", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "indexesFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isLive", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "liveMarkets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "liveMarketsFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "marketPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "markets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "marketsForQuote",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "metadata", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payoutFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pendingFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pullTerms", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pushTerms", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemAll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "req", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAuthority",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setRewards", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "terms", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "userTerms", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "whitelist", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "whitelisted",
    data: BytesLike
  ): Result;

  events: {
    "AuthorityUpdated(address)": EventFragment;
    "Bond(uint256,uint256,uint256)": EventFragment;
    "CloseMarket(uint256)": EventFragment;
    "CreateMarket(uint256,address,address,uint256)": EventFragment;
    "Tuned(uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AuthorityUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Bond"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CloseMarket"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CreateMarket"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Tuned"): EventFragment;
}

export type AuthorityUpdatedEvent = TypedEvent<
  [string] & { authority: string }
>;

export type BondEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber] & {
    id: BigNumber;
    amount: BigNumber;
    price: BigNumber;
  }
>;

export type CloseMarketEvent = TypedEvent<[BigNumber] & { id: BigNumber }>;

export type CreateMarketEvent = TypedEvent<
  [BigNumber, string, string, BigNumber] & {
    id: BigNumber;
    baseToken: string;
    asset: string;
    initialPrice: BigNumber;
  }
>;

export type TunedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber] & {
    id: BigNumber;
    oldControlVariable: BigNumber;
    newControlVariable: BigNumber;
  }
>;

export class BondDepository extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: BondDepositoryInterface;

  functions: {
    adjustments(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, boolean] & {
        change: BigNumber;
        lastAdjustment: number;
        timeToAdjusted: number;
        active: boolean;
      }
    >;

    authority(overrides?: CallOverrides): Promise<[string]>;

    close(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    create(
      _asset: string,
      _market: [BigNumberish, BigNumberish, BigNumberish],
      _booleans: [boolean, boolean],
      _terms: [BigNumberish, BigNumberish],
      _intervals: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    currentControlVariable(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    currentDebt(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    daoReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    debtDecay(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    debtRatio(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    deposit(
      _id: BigNumberish,
      _amount: BigNumberish,
      _maxPrice: BigNumberish,
      _user: string,
      _referral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    indexesFor(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    isLive(_id: BigNumberish, overrides?: CallOverrides): Promise<[boolean]>;

    liveMarkets(overrides?: CallOverrides): Promise<[BigNumber[]]>;

    liveMarketsFor(
      _token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    marketPrice(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    markets(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        boolean,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ] & {
        capacity: BigNumber;
        asset: string;
        capacityInQuote: boolean;
        totalDebt: BigNumber;
        maxPayout: BigNumber;
        sold: BigNumber;
        purchased: BigNumber;
      }
    >;

    marketsForQuote(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    metadata(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, number, number, number, number] & {
        lastTune: number;
        lastDecay: number;
        length: number;
        depositInterval: number;
        tuneInterval: number;
        assetDecimals: number;
      }
    >;

    payoutFor(
      _amount: BigNumberish,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean] & { payout_: BigNumber; matured_: boolean }
    >;

    pullTerms(
      _from: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    pushTerms(
      _to: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeem(
      _user: string,
      _indexes: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemAll(
      _user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    refReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    req(overrides?: CallOverrides): Promise<[string]>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRewards(
      _toFrontEnd: BigNumberish,
      _toDAO: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    terms(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, number, number, BigNumber] & {
        fixedTerm: boolean;
        controlVariable: BigNumber;
        vesting: number;
        conclusion: number;
        maxDebt: BigNumber;
      }
    >;

    updateTreasury(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    userTerms(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, number, number] & {
        payout: BigNumber;
        created: number;
        matured: number;
        redeemed: number;
        marketID: number;
      }
    >;

    whitelist(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    whitelisted(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
  };

  adjustments(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number, number, boolean] & {
      change: BigNumber;
      lastAdjustment: number;
      timeToAdjusted: number;
      active: boolean;
    }
  >;

  authority(overrides?: CallOverrides): Promise<string>;

  close(
    _id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  create(
    _asset: string,
    _market: [BigNumberish, BigNumberish, BigNumberish],
    _booleans: [boolean, boolean],
    _terms: [BigNumberish, BigNumberish],
    _intervals: [BigNumberish, BigNumberish],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  currentControlVariable(
    _id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  currentDebt(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  daoReward(overrides?: CallOverrides): Promise<BigNumber>;

  debtDecay(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  debtRatio(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    _id: BigNumberish,
    _amount: BigNumberish,
    _maxPrice: BigNumberish,
    _user: string,
    _referral: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getReward(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  indexesFor(_user: string, overrides?: CallOverrides): Promise<BigNumber[]>;

  isLive(_id: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

  liveMarkets(overrides?: CallOverrides): Promise<BigNumber[]>;

  liveMarketsFor(
    _token: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  marketPrice(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  markets(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, boolean, BigNumber, BigNumber, BigNumber, BigNumber] & {
      capacity: BigNumber;
      asset: string;
      capacityInQuote: boolean;
      totalDebt: BigNumber;
      maxPayout: BigNumber;
      sold: BigNumber;
      purchased: BigNumber;
    }
  >;

  marketsForQuote(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  metadata(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [number, number, number, number, number, number] & {
      lastTune: number;
      lastDecay: number;
      length: number;
      depositInterval: number;
      tuneInterval: number;
      assetDecimals: number;
    }
  >;

  payoutFor(
    _amount: BigNumberish,
    _id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  pendingFor(
    _user: string,
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, boolean] & { payout_: BigNumber; matured_: boolean }>;

  pullTerms(
    _from: string,
    _index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  pushTerms(
    _to: string,
    _index: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeem(
    _user: string,
    _indexes: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemAll(
    _user: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  refReward(overrides?: CallOverrides): Promise<BigNumber>;

  req(overrides?: CallOverrides): Promise<string>;

  rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  setAuthority(
    _newAuthority: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRewards(
    _toFrontEnd: BigNumberish,
    _toDAO: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  terms(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [boolean, BigNumber, number, number, BigNumber] & {
      fixedTerm: boolean;
      controlVariable: BigNumber;
      vesting: number;
      conclusion: number;
      maxDebt: BigNumber;
    }
  >;

  updateTreasury(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  userTerms(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number, number, number, number] & {
      payout: BigNumber;
      created: number;
      matured: number;
      redeemed: number;
      marketID: number;
    }
  >;

  whitelist(
    _operator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  whitelisted(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    adjustments(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, boolean] & {
        change: BigNumber;
        lastAdjustment: number;
        timeToAdjusted: number;
        active: boolean;
      }
    >;

    authority(overrides?: CallOverrides): Promise<string>;

    close(_id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    create(
      _asset: string,
      _market: [BigNumberish, BigNumberish, BigNumberish],
      _booleans: [boolean, boolean],
      _terms: [BigNumberish, BigNumberish],
      _intervals: [BigNumberish, BigNumberish],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentControlVariable(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentDebt(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    daoReward(overrides?: CallOverrides): Promise<BigNumber>;

    debtDecay(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    debtRatio(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _id: BigNumberish,
      _amount: BigNumberish,
      _maxPrice: BigNumberish,
      _user: string,
      _referral: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        payout_: BigNumber;
        expiry_: BigNumber;
        index_: BigNumber;
      }
    >;

    getReward(overrides?: CallOverrides): Promise<void>;

    indexesFor(_user: string, overrides?: CallOverrides): Promise<BigNumber[]>;

    isLive(_id: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    liveMarkets(overrides?: CallOverrides): Promise<BigNumber[]>;

    liveMarketsFor(
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    marketPrice(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    markets(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        string,
        boolean,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ] & {
        capacity: BigNumber;
        asset: string;
        capacityInQuote: boolean;
        totalDebt: BigNumber;
        maxPayout: BigNumber;
        sold: BigNumber;
        purchased: BigNumber;
      }
    >;

    marketsForQuote(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    metadata(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [number, number, number, number, number, number] & {
        lastTune: number;
        lastDecay: number;
        length: number;
        depositInterval: number;
        tuneInterval: number;
        assetDecimals: number;
      }
    >;

    payoutFor(
      _amount: BigNumberish,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean] & { payout_: BigNumber; matured_: boolean }
    >;

    pullTerms(
      _from: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pushTerms(
      _to: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    redeem(
      _user: string,
      _indexes: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemAll(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    refReward(overrides?: CallOverrides): Promise<BigNumber>;

    req(overrides?: CallOverrides): Promise<string>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setAuthority(
      _newAuthority: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setRewards(
      _toFrontEnd: BigNumberish,
      _toDAO: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    terms(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, number, number, BigNumber] & {
        fixedTerm: boolean;
        controlVariable: BigNumber;
        vesting: number;
        conclusion: number;
        maxDebt: BigNumber;
      }
    >;

    updateTreasury(overrides?: CallOverrides): Promise<void>;

    userTerms(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, number, number] & {
        payout: BigNumber;
        created: number;
        matured: number;
        redeemed: number;
        marketID: number;
      }
    >;

    whitelist(_operator: string, overrides?: CallOverrides): Promise<void>;

    whitelisted(arg0: string, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    "AuthorityUpdated(address)"(
      authority?: string | null
    ): TypedEventFilter<[string], { authority: string }>;

    AuthorityUpdated(
      authority?: string | null
    ): TypedEventFilter<[string], { authority: string }>;

    "Bond(uint256,uint256,uint256)"(
      id?: BigNumberish | null,
      amount?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { id: BigNumber; amount: BigNumber; price: BigNumber }
    >;

    Bond(
      id?: BigNumberish | null,
      amount?: null,
      price?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      { id: BigNumber; amount: BigNumber; price: BigNumber }
    >;

    "CloseMarket(uint256)"(
      id?: BigNumberish | null
    ): TypedEventFilter<[BigNumber], { id: BigNumber }>;

    CloseMarket(
      id?: BigNumberish | null
    ): TypedEventFilter<[BigNumber], { id: BigNumber }>;

    "CreateMarket(uint256,address,address,uint256)"(
      id?: BigNumberish | null,
      baseToken?: string | null,
      asset?: string | null,
      initialPrice?: null
    ): TypedEventFilter<
      [BigNumber, string, string, BigNumber],
      {
        id: BigNumber;
        baseToken: string;
        asset: string;
        initialPrice: BigNumber;
      }
    >;

    CreateMarket(
      id?: BigNumberish | null,
      baseToken?: string | null,
      asset?: string | null,
      initialPrice?: null
    ): TypedEventFilter<
      [BigNumber, string, string, BigNumber],
      {
        id: BigNumber;
        baseToken: string;
        asset: string;
        initialPrice: BigNumber;
      }
    >;

    "Tuned(uint256,uint256,uint256)"(
      id?: BigNumberish | null,
      oldControlVariable?: null,
      newControlVariable?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      {
        id: BigNumber;
        oldControlVariable: BigNumber;
        newControlVariable: BigNumber;
      }
    >;

    Tuned(
      id?: BigNumberish | null,
      oldControlVariable?: null,
      newControlVariable?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber],
      {
        id: BigNumber;
        oldControlVariable: BigNumber;
        newControlVariable: BigNumber;
      }
    >;
  };

  estimateGas: {
    adjustments(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    authority(overrides?: CallOverrides): Promise<BigNumber>;

    close(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    create(
      _asset: string,
      _market: [BigNumberish, BigNumberish, BigNumberish],
      _booleans: [boolean, boolean],
      _terms: [BigNumberish, BigNumberish],
      _intervals: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    currentControlVariable(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    currentDebt(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    daoReward(overrides?: CallOverrides): Promise<BigNumber>;

    debtDecay(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    debtRatio(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _id: BigNumberish,
      _amount: BigNumberish,
      _maxPrice: BigNumberish,
      _user: string,
      _referral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    indexesFor(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    isLive(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    liveMarkets(overrides?: CallOverrides): Promise<BigNumber>;

    liveMarketsFor(
      _token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    marketPrice(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    markets(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    marketsForQuote(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    metadata(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    payoutFor(
      _amount: BigNumberish,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pullTerms(
      _from: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    pushTerms(
      _to: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeem(
      _user: string,
      _indexes: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemAll(
      _user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    refReward(overrides?: CallOverrides): Promise<BigNumber>;

    req(overrides?: CallOverrides): Promise<BigNumber>;

    rewards(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRewards(
      _toFrontEnd: BigNumberish,
      _toDAO: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    terms(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    updateTreasury(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    userTerms(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    whitelist(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    whitelisted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    adjustments(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    authority(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    close(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    create(
      _asset: string,
      _market: [BigNumberish, BigNumberish, BigNumberish],
      _booleans: [boolean, boolean],
      _terms: [BigNumberish, BigNumberish],
      _intervals: [BigNumberish, BigNumberish],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    currentControlVariable(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    currentDebt(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    daoReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    debtDecay(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    debtRatio(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposit(
      _id: BigNumberish,
      _amount: BigNumberish,
      _maxPrice: BigNumberish,
      _user: string,
      _referral: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    indexesFor(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isLive(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    liveMarkets(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    liveMarketsFor(
      _token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    marketPrice(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    markets(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    marketsForQuote(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    metadata(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    payoutFor(
      _amount: BigNumberish,
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pullTerms(
      _from: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    pushTerms(
      _to: string,
      _index: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeem(
      _user: string,
      _indexes: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemAll(
      _user: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    refReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    req(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewards(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setAuthority(
      _newAuthority: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRewards(
      _toFrontEnd: BigNumberish,
      _toDAO: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    terms(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    updateTreasury(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    userTerms(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    whitelist(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    whitelisted(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

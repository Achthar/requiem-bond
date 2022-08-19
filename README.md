# Requiem Bonding contracts
Interface to invest in Requiem Asset Backed Token.
 
Inspired by OlympusDAO V2 contracts.
 
- *BondingDepository:            OlympusDAO type bonding*
   - ideal for stable coins or stable pool lp
- *DigitalCallBondDepository:    Bond with Digital Call*
   - Allows indexing based on custom defined index (so far direct infusion of ChainLink (Avax Test) or Band Oracles (Oasis Test) allowing BTC, ETH, AVAX, ROSE and more)
   - Each bond has a pre-defined strike percentage `S`, digital payoff `D` (as a percentage of abREQ notional amount `N` obtained by bonding) and maturity
   - The user gets an additional `N*D` abREQ if the index price increased by `S`
   - Allows participation of positive price performance for the user when bonding
- *CallableBondDepository:       Callable Bond*
   - On creation of the bond a strike percentage `S` for a given index, maturity and max payoff percentage `M` is set
   - On bonding the user receives a (locked) notional amount `N` in abREQ and the index entry price `I_0` is recorded
   - The user can claim the bond early if the index price `I_t` at a time `t` rises by `S`, i.e.`I_t/I_0 - 1 >= S` and gets the additional payoff `N*max(I_t/I_0 - 1, M)` in abREQ
   - This structure allows users to bond volatile assets and receive benefits if the asset performs well
   - Exposure of abREQ is limited as the payout for a user is capped
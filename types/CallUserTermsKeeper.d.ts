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

interface CallUserTermsKeeperInterface extends ethers.utils.Interface {
  functions: {
    "authority()": FunctionFragment;
    "daoReward()": FunctionFragment;
    "getLatestPriceData(address)": FunctionFragment;
    "getReward()": FunctionFragment;
    "indexesFor(address)": FunctionFragment;
    "pendingFor(address,uint256)": FunctionFragment;
    "perf(int256,int256)": FunctionFragment;
    "pullTerms(address,uint256)": FunctionFragment;
    "pushTerms(address,uint256)": FunctionFragment;
    "refReward()": FunctionFragment;
    "req()": FunctionFragment;
    "rewards(address)": FunctionFragment;
    "setAuthority(address)": FunctionFragment;
    "setRewards(uint256,uint256)": FunctionFragment;
    "updateTreasury()": FunctionFragment;
    "userTerms(address,uint256)": FunctionFragment;
    "whitelist(address)": FunctionFragment;
    "whitelisted(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "authority", values?: undefined): string;
  encodeFunctionData(functionFragment: "daoReward", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getLatestPriceData",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getReward", values?: undefined): string;
  encodeFunctionData(functionFragment: "indexesFor", values: [string]): string;
  encodeFunctionData(
    functionFragment: "pendingFor",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "perf",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pullTerms",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "pushTerms",
    values: [string, BigNumberish]
  ): string;
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

  decodeFunctionResult(functionFragment: "authority", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "daoReward", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getLatestPriceData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "indexesFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pendingFor", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "perf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pullTerms", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pushTerms", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "req", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setAuthority",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setRewards", data: BytesLike): Result;
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
  };

  getEvent(nameOrSignatureOrTopic: "AuthorityUpdated"): EventFragment;
}

export type AuthorityUpdatedEvent = TypedEvent<
  [string] & { authority: string }
>;

export class CallUserTermsKeeper extends BaseContract {
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

  interface: CallUserTermsKeeperInterface;

  functions: {
    authority(overrides?: CallOverrides): Promise<[string]>;

    daoReward(overrides?: CallOverrides): Promise<[BigNumber]>;

    getLatestPriceData(
      _feed: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        roundId: BigNumber;
        answer: BigNumber;
        startedAt: BigNumber;
        updatedAt: BigNumber;
        answeredInRound: BigNumber;
      }
    >;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    indexesFor(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean, boolean] & {
        payout_: BigNumber;
        matured_: boolean;
        payoffClaimable_: boolean;
      }
    >;

    perf(
      _newPrice: BigNumberish,
      _oldPrice: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

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

    updateTreasury(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    userTerms(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        number,
        number
      ] & {
        cryptoIntitialPrice: BigNumber;
        cryptoClosingPrice: BigNumber;
        payout: BigNumber;
        created: number;
        matured: number;
        redeemed: number;
        exercised: number;
        marketID: number;
      }
    >;

    whitelist(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    whitelisted(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
  };

  authority(overrides?: CallOverrides): Promise<string>;

  daoReward(overrides?: CallOverrides): Promise<BigNumber>;

  getLatestPriceData(
    _feed: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      roundId: BigNumber;
      answer: BigNumber;
      startedAt: BigNumber;
      updatedAt: BigNumber;
      answeredInRound: BigNumber;
    }
  >;

  getReward(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  indexesFor(_user: string, overrides?: CallOverrides): Promise<BigNumber[]>;

  pendingFor(
    _user: string,
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, boolean, boolean] & {
      payout_: BigNumber;
      matured_: boolean;
      payoffClaimable_: boolean;
    }
  >;

  perf(
    _newPrice: BigNumberish,
    _oldPrice: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

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

  updateTreasury(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  userTerms(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      BigNumber,
      BigNumber,
      number,
      number,
      number,
      number,
      number
    ] & {
      cryptoIntitialPrice: BigNumber;
      cryptoClosingPrice: BigNumber;
      payout: BigNumber;
      created: number;
      matured: number;
      redeemed: number;
      exercised: number;
      marketID: number;
    }
  >;

  whitelist(
    _operator: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  whitelisted(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    authority(overrides?: CallOverrides): Promise<string>;

    daoReward(overrides?: CallOverrides): Promise<BigNumber>;

    getLatestPriceData(
      _feed: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        roundId: BigNumber;
        answer: BigNumber;
        startedAt: BigNumber;
        updatedAt: BigNumber;
        answeredInRound: BigNumber;
      }
    >;

    getReward(overrides?: CallOverrides): Promise<void>;

    indexesFor(_user: string, overrides?: CallOverrides): Promise<BigNumber[]>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean, boolean] & {
        payout_: BigNumber;
        matured_: boolean;
        payoffClaimable_: boolean;
      }
    >;

    perf(
      _newPrice: BigNumberish,
      _oldPrice: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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

    updateTreasury(overrides?: CallOverrides): Promise<void>;

    userTerms(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        number,
        number
      ] & {
        cryptoIntitialPrice: BigNumber;
        cryptoClosingPrice: BigNumber;
        payout: BigNumber;
        created: number;
        matured: number;
        redeemed: number;
        exercised: number;
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
  };

  estimateGas: {
    authority(overrides?: CallOverrides): Promise<BigNumber>;

    daoReward(overrides?: CallOverrides): Promise<BigNumber>;

    getLatestPriceData(
      _feed: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    indexesFor(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    perf(
      _newPrice: BigNumberish,
      _oldPrice: BigNumberish,
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
    authority(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    daoReward(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLatestPriceData(
      _feed: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    indexesFor(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pendingFor(
      _user: string,
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    perf(
      _newPrice: BigNumberish,
      _oldPrice: BigNumberish,
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

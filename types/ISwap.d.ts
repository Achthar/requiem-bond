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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ISwapInterface extends ethers.utils.Interface {
  functions: {
    "calculateSwapGivenIn(address,address,uint256)": FunctionFragment;
    "getPooledTokens()": FunctionFragment;
    "getTokenBalances()": FunctionFragment;
    "getTokenMultipliers()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculateSwapGivenIn",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPooledTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenBalances",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenMultipliers",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "calculateSwapGivenIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPooledTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenBalances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenMultipliers",
    data: BytesLike
  ): Result;

  events: {};
}

export class ISwap extends BaseContract {
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

  interface: ISwapInterface;

  functions: {
    calculateSwapGivenIn(
      tokenIn: string,
      tokenOut: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPooledTokens(overrides?: CallOverrides): Promise<[string[]]>;

    getTokenBalances(overrides?: CallOverrides): Promise<[BigNumber[]]>;

    getTokenMultipliers(overrides?: CallOverrides): Promise<[BigNumber[]]>;
  };

  calculateSwapGivenIn(
    tokenIn: string,
    tokenOut: string,
    amountIn: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPooledTokens(overrides?: CallOverrides): Promise<string[]>;

  getTokenBalances(overrides?: CallOverrides): Promise<BigNumber[]>;

  getTokenMultipliers(overrides?: CallOverrides): Promise<BigNumber[]>;

  callStatic: {
    calculateSwapGivenIn(
      tokenIn: string,
      tokenOut: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPooledTokens(overrides?: CallOverrides): Promise<string[]>;

    getTokenBalances(overrides?: CallOverrides): Promise<BigNumber[]>;

    getTokenMultipliers(overrides?: CallOverrides): Promise<BigNumber[]>;
  };

  filters: {};

  estimateGas: {
    calculateSwapGivenIn(
      tokenIn: string,
      tokenOut: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPooledTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getTokenBalances(overrides?: CallOverrides): Promise<BigNumber>;

    getTokenMultipliers(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    calculateSwapGivenIn(
      tokenIn: string,
      tokenOut: string,
      amountIn: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPooledTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokenBalances(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokenMultipliers(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

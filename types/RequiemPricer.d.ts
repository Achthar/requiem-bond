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

interface RequiemPricerInterface extends ethers.utils.Interface {
  functions: {
    "REQ()": FunctionFragment;
    "getTotalSlashedValue(address,address)": FunctionFragment;
    "getTotalValue(address,address)": FunctionFragment;
    "slashedValuation(address,address,uint256)": FunctionFragment;
    "valuation(address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "REQ", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getTotalSlashedValue",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalValue",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "slashedValuation",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "valuation",
    values: [string, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "REQ", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTotalSlashedValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "slashedValuation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "valuation", data: BytesLike): Result;

  events: {};
}

export class RequiemPricer extends BaseContract {
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

  interface: RequiemPricerInterface;

  functions: {
    REQ(overrides?: CallOverrides): Promise<[string]>;

    getTotalSlashedValue(
      _pair: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;

    getTotalValue(
      _pair: string,
      _quote: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;

    slashedValuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;

    valuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _value: BigNumber }>;
  };

  REQ(overrides?: CallOverrides): Promise<string>;

  getTotalSlashedValue(
    _pair: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTotalValue(
    _pair: string,
    _quote: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  slashedValuation(
    _pair: string,
    _quote: string,
    _amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  valuation(
    _pair: string,
    _quote: string,
    _amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    REQ(overrides?: CallOverrides): Promise<string>;

    getTotalSlashedValue(
      _pair: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalValue(
      _pair: string,
      _quote: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    slashedValuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    valuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    REQ(overrides?: CallOverrides): Promise<BigNumber>;

    getTotalSlashedValue(
      _pair: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalValue(
      _pair: string,
      _quote: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    slashedValuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    valuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    REQ(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTotalSlashedValue(
      _pair: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalValue(
      _pair: string,
      _quote: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    slashedValuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    valuation(
      _pair: string,
      _quote: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

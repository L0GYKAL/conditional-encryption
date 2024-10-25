/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace TypesLib {
  export type DecryptionRequestStruct = {
    Ciphertext: BytesLike;
    conditions: BytesLike;
    decryptedText: BytesLike;
    messageToSign: BytesLike;
    signature: BytesLike;
    callback: AddressLike;
  };

  export type DecryptionRequestStructOutput = [
    Ciphertext: string,
    conditions: string,
    decryptedText: string,
    messageToSign: string,
    signature: string,
    callback: string
  ] & {
    Ciphertext: string;
    conditions: string;
    decryptedText: string;
    messageToSign: string;
    signature: string;
    callback: string;
  };
}

export interface DecryptionSenderInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getAllRequests"
      | "getRequest"
      | "isInFlight"
      | "messageFrom"
      | "receiveSignature"
      | "registerCiphertext"
      | "schemeID"
      | "sendDecryptedCiphertext"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "CipherTextRegistered"
      | "DecryptionReceiverCallbackFailed"
      | "DecryptionReceiverCallbackSuccess"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "getAllRequests",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRequest",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isInFlight",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "messageFrom",
    values: [TypesLib.DecryptionRequestStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "receiveSignature",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "registerCiphertext",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "schemeID", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "sendDecryptedCiphertext",
    values: [BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getAllRequests",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRequest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isInFlight", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "messageFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receiveSignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerCiphertext",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "schemeID", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sendDecryptedCiphertext",
    data: BytesLike
  ): Result;
}

export namespace CipherTextRegisteredEvent {
  export type InputTuple = [
    requestID: BigNumberish,
    requester: AddressLike,
    Ciphertext: BytesLike,
    message: BytesLike,
    conditions: BytesLike,
    registeredAt: BigNumberish
  ];
  export type OutputTuple = [
    requestID: bigint,
    requester: string,
    Ciphertext: string,
    message: string,
    conditions: string,
    registeredAt: bigint
  ];
  export interface OutputObject {
    requestID: bigint;
    requester: string;
    Ciphertext: string;
    message: string;
    conditions: string;
    registeredAt: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DecryptionReceiverCallbackFailedEvent {
  export type InputTuple = [requestID: BigNumberish];
  export type OutputTuple = [requestID: bigint];
  export interface OutputObject {
    requestID: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DecryptionReceiverCallbackSuccessEvent {
  export type InputTuple = [requestID: BigNumberish];
  export type OutputTuple = [requestID: bigint];
  export interface OutputObject {
    requestID: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface DecryptionSender extends BaseContract {
  connect(runner?: ContractRunner | null): DecryptionSender;
  waitForDeployment(): Promise<this>;

  interface: DecryptionSenderInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getAllRequests: TypedContractMethod<
    [],
    [TypesLib.DecryptionRequestStructOutput[]],
    "view"
  >;

  getRequest: TypedContractMethod<
    [requestId: BigNumberish],
    [TypesLib.DecryptionRequestStructOutput],
    "view"
  >;

  isInFlight: TypedContractMethod<[requestID: BigNumberish], [boolean], "view">;

  messageFrom: TypedContractMethod<
    [r: TypesLib.DecryptionRequestStruct],
    [string],
    "view"
  >;

  receiveSignature: TypedContractMethod<
    [requestID: BigNumberish, signature: BytesLike],
    [void],
    "nonpayable"
  >;

  registerCiphertext: TypedContractMethod<
    [ciphertext: BytesLike, conditions: BytesLike],
    [bigint],
    "nonpayable"
  >;

  schemeID: TypedContractMethod<[], [string], "view">;

  sendDecryptedCiphertext: TypedContractMethod<
    [requestID: BigNumberish, decryptedText: BytesLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getAllRequests"
  ): TypedContractMethod<
    [],
    [TypesLib.DecryptionRequestStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRequest"
  ): TypedContractMethod<
    [requestId: BigNumberish],
    [TypesLib.DecryptionRequestStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "isInFlight"
  ): TypedContractMethod<[requestID: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "messageFrom"
  ): TypedContractMethod<
    [r: TypesLib.DecryptionRequestStruct],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "receiveSignature"
  ): TypedContractMethod<
    [requestID: BigNumberish, signature: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "registerCiphertext"
  ): TypedContractMethod<
    [ciphertext: BytesLike, conditions: BytesLike],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "schemeID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "sendDecryptedCiphertext"
  ): TypedContractMethod<
    [requestID: BigNumberish, decryptedText: BytesLike],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "CipherTextRegistered"
  ): TypedContractEvent<
    CipherTextRegisteredEvent.InputTuple,
    CipherTextRegisteredEvent.OutputTuple,
    CipherTextRegisteredEvent.OutputObject
  >;
  getEvent(
    key: "DecryptionReceiverCallbackFailed"
  ): TypedContractEvent<
    DecryptionReceiverCallbackFailedEvent.InputTuple,
    DecryptionReceiverCallbackFailedEvent.OutputTuple,
    DecryptionReceiverCallbackFailedEvent.OutputObject
  >;
  getEvent(
    key: "DecryptionReceiverCallbackSuccess"
  ): TypedContractEvent<
    DecryptionReceiverCallbackSuccessEvent.InputTuple,
    DecryptionReceiverCallbackSuccessEvent.OutputTuple,
    DecryptionReceiverCallbackSuccessEvent.OutputObject
  >;

  filters: {
    "CipherTextRegistered(uint256,address,bytes,bytes,bytes,uint256)": TypedContractEvent<
      CipherTextRegisteredEvent.InputTuple,
      CipherTextRegisteredEvent.OutputTuple,
      CipherTextRegisteredEvent.OutputObject
    >;
    CipherTextRegistered: TypedContractEvent<
      CipherTextRegisteredEvent.InputTuple,
      CipherTextRegisteredEvent.OutputTuple,
      CipherTextRegisteredEvent.OutputObject
    >;

    "DecryptionReceiverCallbackFailed(uint256)": TypedContractEvent<
      DecryptionReceiverCallbackFailedEvent.InputTuple,
      DecryptionReceiverCallbackFailedEvent.OutputTuple,
      DecryptionReceiverCallbackFailedEvent.OutputObject
    >;
    DecryptionReceiverCallbackFailed: TypedContractEvent<
      DecryptionReceiverCallbackFailedEvent.InputTuple,
      DecryptionReceiverCallbackFailedEvent.OutputTuple,
      DecryptionReceiverCallbackFailedEvent.OutputObject
    >;

    "DecryptionReceiverCallbackSuccess(uint256)": TypedContractEvent<
      DecryptionReceiverCallbackSuccessEvent.InputTuple,
      DecryptionReceiverCallbackSuccessEvent.OutputTuple,
      DecryptionReceiverCallbackSuccessEvent.OutputObject
    >;
    DecryptionReceiverCallbackSuccess: TypedContractEvent<
      DecryptionReceiverCallbackSuccessEvent.InputTuple,
      DecryptionReceiverCallbackSuccessEvent.OutputTuple,
      DecryptionReceiverCallbackSuccessEvent.OutputObject
    >;
  };
}
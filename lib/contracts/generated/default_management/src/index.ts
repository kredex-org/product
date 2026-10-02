import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDXUYZL5IJNGN742IZTC7H4IBKNEGTSMZACO76LXTVJSDVXXF2NSBOED",
  }
} as const

export type DataKey = {tag: "DefaultRecord", values: readonly [u32]} | {tag: "InsuranceBalance", values: void} | {tag: "InsuranceEvent", values: readonly [u32]} | {tag: "InsuranceEventCount", values: void} | {tag: "Admins", values: void} | {tag: "IsPaused", values: void} | {tag: "UsdcToken", values: void} | {tag: "LendingContract", values: void};

export type DefaultPhase = {tag: "Friendly", values: void} | {tag: "Warning", values: void} | {tag: "Enforcement", values: void} | {tag: "Reported", values: void};


export interface DefaultRecord {
  amount: i128;
  borrower: string;
  days_overdue: u64;
  loan_id: u32;
  phase: DefaultPhase;
  recorded_at: u64;
}


export interface InsuranceEvent {
  amount_paid: i128;
  lender: string;
  loan_id: u32;
  paid_at: u64;
  token: string;
}

export interface Client {
  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pause: ({caller1, caller2}: {caller1: string, caller2: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unpause: ({caller1, caller2}: {caller1: string, caller2: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_paused: (options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_admins transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_admins: (options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin1, admin2, admin3, usdc_token, lending_contract, insurance_seed_amount}: {admin1: string, admin2: string, admin3: string, usdc_token: string, lending_contract: string, insurance_seed_amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_usdc_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_usdc_token: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a record_default transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  record_default: ({caller, loan_id, borrower, amount, days_overdue}: {caller: string, loan_id: u32, borrower: string, amount: i128, days_overdue: u64}, options?: MethodOptions) => Promise<AssembledTransaction<DefaultPhase>>

  /**
   * Construct and simulate a add_to_insurance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_to_insurance: ({caller1, caller2, amount}: {caller1: string, caller2: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a bump_default_ttl transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bump_default_ttl: ({loan_id}: {loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_default_record transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_default_record: ({loan_id}: {loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<DefaultRecord>>

  /**
   * Construct and simulate a get_insurance_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_insurance_event: ({event_index}: {event_index: u32}, options?: MethodOptions) => Promise<AssembledTransaction<InsuranceEvent>>

  /**
   * Construct and simulate a get_insurance_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_insurance_balance: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a trigger_insurance_payout transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  trigger_insurance_payout: ({caller1, caller2, loan_id, lender, amount}: {caller1: string, caller2: string, loan_id: u32, lender: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_insurance_event_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_insurance_event_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAFcGF1c2UAAAAAAAACAAAAAAAAAAdjYWxsZXIxAAAAABMAAAAAAAAAB2NhbGxlcjIAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAHdW5wYXVzZQAAAAACAAAAAAAAAAdjYWxsZXIxAAAAABMAAAAAAAAAB2NhbGxlcjIAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAJaXNfcGF1c2VkAAAAAAAAAAAAAAEAAAAB",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAACAAAAAEAAAAAAAAADURlZmF1bHRSZWNvcmQAAAAAAAABAAAABAAAAAAAAAAAAAAAEEluc3VyYW5jZUJhbGFuY2UAAAABAAAAAAAAAA5JbnN1cmFuY2VFdmVudAAAAAAAAQAAAAQAAAAAAAAAAAAAABNJbnN1cmFuY2VFdmVudENvdW50AAAAAAAAAAAAAAAABkFkbWlucwAAAAAAAAAAAAAAAAAISXNQYXVzZWQAAAAAAAAAAAAAAAlVc2RjVG9rZW4AAAAAAAAAAAAAAAAAAA9MZW5kaW5nQ29udHJhY3QA",
        "AAAAAAAAAAAAAAAKZ2V0X2FkbWlucwAAAAAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAGYWRtaW4xAAAAAAATAAAAAAAAAAZhZG1pbjIAAAAAABMAAAAAAAAABmFkbWluMwAAAAAAEwAAAAAAAAAKdXNkY190b2tlbgAAAAAAEwAAAAAAAAAQbGVuZGluZ19jb250cmFjdAAAABMAAAAAAAAAFWluc3VyYW5jZV9zZWVkX2Ftb3VudAAAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X3VzZGNfdG9rZW4AAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAOcmVjb3JkX2RlZmF1bHQAAAAAAAUAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAHbG9hbl9pZAAAAAAEAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAMZGF5c19vdmVyZHVlAAAABgAAAAEAAAfQAAAADERlZmF1bHRQaGFzZQ==",
        "AAAAAgAAAAAAAAAAAAAADERlZmF1bHRQaGFzZQAAAAQAAAAAAAAAAAAAAAhGcmllbmRseQAAAAAAAAAAAAAAB1dhcm5pbmcAAAAAAAAAAAAAAAALRW5mb3JjZW1lbnQAAAAAAAAAAAAAAAAIUmVwb3J0ZWQ=",
        "AAAAAQAAAAAAAAAAAAAADURlZmF1bHRSZWNvcmQAAAAAAAAGAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAMZGF5c19vdmVyZHVlAAAABgAAAAAAAAAHbG9hbl9pZAAAAAAEAAAAAAAAAAVwaGFzZQAAAAAAB9AAAAAMRGVmYXVsdFBoYXNlAAAAAAAAAAtyZWNvcmRlZF9hdAAAAAAG",
        "AAAAAAAAAAAAAAAQYWRkX3RvX2luc3VyYW5jZQAAAAMAAAAAAAAAB2NhbGxlcjEAAAAAEwAAAAAAAAAHY2FsbGVyMgAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAQYnVtcF9kZWZhdWx0X3R0bAAAAAEAAAAAAAAAB2xvYW5faWQAAAAABAAAAAA=",
        "AAAAAQAAAAAAAAAAAAAADkluc3VyYW5jZUV2ZW50AAAAAAAFAAAAAAAAAAthbW91bnRfcGFpZAAAAAALAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAAAAAAB2xvYW5faWQAAAAABAAAAAAAAAAHcGFpZF9hdAAAAAAGAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAAAAAAAAAAASZ2V0X2RlZmF1bHRfcmVjb3JkAAAAAAABAAAAAAAAAAdsb2FuX2lkAAAAAAQAAAABAAAH0AAAAA1EZWZhdWx0UmVjb3JkAAAA",
        "AAAAAAAAAAAAAAATZ2V0X2luc3VyYW5jZV9ldmVudAAAAAABAAAAAAAAAAtldmVudF9pbmRleAAAAAAEAAAAAQAAB9AAAAAOSW5zdXJhbmNlRXZlbnQAAA==",
        "AAAAAAAAAAAAAAAVZ2V0X2luc3VyYW5jZV9iYWxhbmNlAAAAAAAAAAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAYdHJpZ2dlcl9pbnN1cmFuY2VfcGF5b3V0AAAABQAAAAAAAAAHY2FsbGVyMQAAAAATAAAAAAAAAAdjYWxsZXIyAAAAABMAAAAAAAAAB2xvYW5faWQAAAAABAAAAAAAAAAGbGVuZGVyAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAZZ2V0X2luc3VyYW5jZV9ldmVudF9jb3VudAAAAAAAAAAAAAABAAAABA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    pause: this.txFromJSON<null>,
        unpause: this.txFromJSON<null>,
        is_paused: this.txFromJSON<boolean>,
        get_admins: this.txFromJSON<Array<string>>,
        initialize: this.txFromJSON<null>,
        get_usdc_token: this.txFromJSON<string>,
        record_default: this.txFromJSON<DefaultPhase>,
        add_to_insurance: this.txFromJSON<null>,
        bump_default_ttl: this.txFromJSON<null>,
        get_default_record: this.txFromJSON<DefaultRecord>,
        get_insurance_event: this.txFromJSON<InsuranceEvent>,
        get_insurance_balance: this.txFromJSON<i128>,
        trigger_insurance_payout: this.txFromJSON<null>,
        get_insurance_event_count: this.txFromJSON<u32>
  }
}
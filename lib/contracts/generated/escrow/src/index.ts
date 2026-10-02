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
    contractId: "CBNF4KK4JHQ5UUUC4W65WHA3WOB2FWCIRG3L2R3M5TEKKE6ZPSMUEAP5",
  }
} as const

export type DataKey = {tag: "Hold", values: readonly [u32]} | {tag: "EscrowCount", values: void} | {tag: "Admins", values: void} | {tag: "IsPaused", values: void} | {tag: "UsdcToken", values: void};


export interface EscrowHold {
  amount: i128;
  borrower: string;
  expires_at: u64;
  held_at: u64;
  id: u32;
  lender: string;
  loan_id: u32;
  status: EscrowStatus;
  token: string;
}

export type EscrowStatus = {tag: "Held", values: void} | {tag: "Transferred", values: void} | {tag: "Revoked", values: void};

export interface Client {
  /**
   * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pause the contract. Requires 2 distinct admin signatures.
   */
  pause: ({caller1, caller2}: {caller1: string, caller2: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Unpause the contract. Requires 2 distinct admin signatures.
   */
  unpause: ({caller1, caller2}: {caller1: string, caller2: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_hold transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_hold: ({escrow_id}: {escrow_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<EscrowHold>>

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
   * One-time initialisation with 3 admin addresses.
   */
  initialize: ({admin1, admin2, admin3, usdc_token}: {admin1: string, admin2: string, admin3: string, usdc_token: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_hold transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_hold: ({lender, borrower, loan_id, amount}: {lender: string, borrower: string, loan_id: u32, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a revoke_hold transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  revoke_hold: ({lender, escrow_id}: {lender: string, escrow_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a bump_hold_ttl transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bump_hold_ttl: ({escrow_id}: {escrow_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_usdc_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_usdc_token: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_escrow_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_escrow_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a confirm_disbursement transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  confirm_disbursement: ({caller, escrow_id}: {caller: string, escrow_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_within_revocation_window transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_within_revocation_window: ({escrow_id}: {escrow_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

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
      new ContractSpec([ "AAAAAAAAADlQYXVzZSB0aGUgY29udHJhY3QuIFJlcXVpcmVzIDIgZGlzdGluY3QgYWRtaW4gc2lnbmF0dXJlcy4AAAAAAAAFcGF1c2UAAAAAAAACAAAAAAAAAAdjYWxsZXIxAAAAABMAAAAAAAAAB2NhbGxlcjIAAAAAEwAAAAA=",
        "AAAAAAAAADtVbnBhdXNlIHRoZSBjb250cmFjdC4gUmVxdWlyZXMgMiBkaXN0aW5jdCBhZG1pbiBzaWduYXR1cmVzLgAAAAAHdW5wYXVzZQAAAAACAAAAAAAAAAdjYWxsZXIxAAAAABMAAAAAAAAAB2NhbGxlcjIAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAIZ2V0X2hvbGQAAAABAAAAAAAAAAllc2Nyb3dfaWQAAAAAAAAEAAAAAQAAB9AAAAAKRXNjcm93SG9sZAAA",
        "AAAAAAAAAAAAAAAJaXNfcGF1c2VkAAAAAAAAAAAAAAEAAAAB",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAABEhvbGQAAAABAAAABAAAAAAAAAAAAAAAC0VzY3Jvd0NvdW50AAAAAAAAAAAlU3RvcmVzIHRoZSBhcnJheSBvZiAzIGFkbWluIGFkZHJlc3NlcwAAAAAAAAZBZG1pbnMAAAAAAAAAAAAgQm9vbGVhbiBmbGFnIGZvciBlbWVyZ2VuY3kgcGF1c2UAAAAISXNQYXVzZWQAAAAAAAAAAAAAAAlVc2RjVG9rZW4AAAA=",
        "AAAAAAAAAAAAAAAKZ2V0X2FkbWlucwAAAAAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAAAAAC9PbmUtdGltZSBpbml0aWFsaXNhdGlvbiB3aXRoIDMgYWRtaW4gYWRkcmVzc2VzLgAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAGYWRtaW4xAAAAAAATAAAAAAAAAAZhZG1pbjIAAAAAABMAAAAAAAAABmFkbWluMwAAAAAAEwAAAAAAAAAKdXNkY190b2tlbgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAALY3JlYXRlX2hvbGQAAAAABAAAAAAAAAAGbGVuZGVyAAAAAAATAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAAB2xvYW5faWQAAAAABAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAAAQ=",
        "AAAAAAAAAAAAAAALcmV2b2tlX2hvbGQAAAAAAgAAAAAAAAAGbGVuZGVyAAAAAAATAAAAAAAAAAllc2Nyb3dfaWQAAAAAAAAEAAAAAA==",
        "AAAAAQAAAAAAAAAAAAAACkVzY3Jvd0hvbGQAAAAAAAkAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAApleHBpcmVzX2F0AAAAAAAGAAAAAAAAAAdoZWxkX2F0AAAAAAYAAAAAAAAAAmlkAAAAAAAEAAAAAAAAAAZsZW5kZXIAAAAAABMAAAAAAAAAB2xvYW5faWQAAAAABAAAAAAAAAAGc3RhdHVzAAAAAAfQAAAADEVzY3Jvd1N0YXR1cwAAAAAAAAAFdG9rZW4AAAAAAAAT",
        "AAAAAAAAAAAAAAANYnVtcF9ob2xkX3R0bAAAAAAAAAEAAAAAAAAACWVzY3Jvd19pZAAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X3VzZGNfdG9rZW4AAAAAAAAAAAABAAAAEw==",
        "AAAAAgAAAAAAAAAAAAAADEVzY3Jvd1N0YXR1cwAAAAMAAAAAAAAAAAAAAARIZWxkAAAAAAAAAAAAAAALVHJhbnNmZXJyZWQAAAAAAAAAAAAAAAAHUmV2b2tlZAA=",
        "AAAAAAAAAAAAAAAQZ2V0X2VzY3Jvd19jb3VudAAAAAAAAAABAAAABA==",
        "AAAAAAAAAAAAAAAUY29uZmlybV9kaXNidXJzZW1lbnQAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACWVzY3Jvd19pZAAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAbaXNfd2l0aGluX3Jldm9jYXRpb25fd2luZG93AAAAAAEAAAAAAAAACWVzY3Jvd19pZAAAAAAAAAQAAAABAAAAAQ==" ]),
      options
    )
  }
  public readonly fromJSON = {
    pause: this.txFromJSON<null>,
        unpause: this.txFromJSON<null>,
        get_hold: this.txFromJSON<EscrowHold>,
        is_paused: this.txFromJSON<boolean>,
        get_admins: this.txFromJSON<Array<string>>,
        initialize: this.txFromJSON<null>,
        create_hold: this.txFromJSON<u32>,
        revoke_hold: this.txFromJSON<null>,
        bump_hold_ttl: this.txFromJSON<null>,
        get_usdc_token: this.txFromJSON<string>,
        get_escrow_count: this.txFromJSON<u32>,
        confirm_disbursement: this.txFromJSON<null>,
        is_within_revocation_window: this.txFromJSON<boolean>
  }
}
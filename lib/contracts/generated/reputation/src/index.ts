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
    contractId: "CDPALR5OWSO2HFSTB262IPUJNGRDVJOE5AGODXPVSSRPWVRAYK5Q6BOV",
  }
} as const

export type DataKey = {tag: "BorrowerProfile", values: readonly [string]} | {tag: "KycTier", values: readonly [string]} | {tag: "Admins", values: void} | {tag: "IsPaused", values: void} | {tag: "LendingContract", values: void} | {tag: "NftContract", values: void};

export type ReputationTier = {tag: "None", values: void} | {tag: "Beginner", values: void} | {tag: "Silver", values: void} | {tag: "Gold", values: void} | {tag: "Platinum", values: void};


export interface BorrowerProfile {
  address: string;
  created_at: u64;
  default_count: u32;
  freeze_reason: string;
  is_frozen: boolean;
  loan_count: u32;
  reputation_score: i128;
  reputation_tier: ReputationTier;
  total_borrowed: i128;
  total_repaid: i128;
}

export type ReputationEvent = {tag: "TestLoanRepaid", values: void} | {tag: "LoanRepaidOnTime", values: void} | {tag: "LoanPaidEarly", values: void} | {tag: "LoanLate1Day", values: void} | {tag: "LoanLate7Days", values: void} | {tag: "LoanDefaulted", values: void} | {tag: "LateWarning", values: void};

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
   * Construct and simulate a is_frozen transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_frozen: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

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
  initialize: ({admin1, admin2, admin3, lending_contract, nft_contract}: {admin1: string, admin2: string, admin3: string, lending_contract: string, nft_contract: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_profile transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_profile: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<BorrowerProfile>>

  /**
   * Construct and simulate a has_profile transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  has_profile: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_kyc_tier transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the KYC tier for a borrower (0=None, 1=Soft, 2=Full).
   */
  get_kyc_tier: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a set_kyc_tier transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set KYC tier. Requires 2-of-3 admin signatures.
   * tier: 0=None, 1=Soft ($500), 2=Full ($5000)
   */
  set_kyc_tier: ({caller1, caller2, borrower, tier}: {caller1: string, caller2: string, borrower: string, tier: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a init_borrower transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init_borrower: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a freeze_account transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Freeze an account. Requires 2-of-3 admin signatures.
   */
  freeze_account: ({caller1, caller2, borrower, reason}: {caller1: string, caller2: string, borrower: string, reason: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a bump_profile_ttl transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bump_profile_ttl: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unfreeze_account transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Unfreeze an account. Requires 2-of-3 admin signatures.
   */
  unfreeze_account: ({caller1, caller2, borrower}: {caller1: string, caller2: string, borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a calculate_max_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  calculate_max_loan: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a update_loan_totals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update cumulative borrowed/repaid totals.
   * ONLY callable by the LendingContract.
   */
  update_loan_totals: ({caller, borrower, borrowed_delta, repaid_delta}: {caller: string, borrower: string, borrowed_delta: i128, repaid_delta: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a add_reputation_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Apply a reputation event.
   * To maximize decentralization, this can ONLY be called by the LendingContract.
   * Admins cannot manually adjust scores.
   */
  add_reputation_event: ({caller, borrower, event}: {caller: string, borrower: string, event: ReputationEvent}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_lending_contract transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_lending_contract: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a calculate_interest_rate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  calculate_interest_rate: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

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
        "AAAAAAAAAAAAAAAJaXNfZnJvemVuAAAAAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAAAE=",
        "AAAAAAAAAAAAAAAJaXNfcGF1c2VkAAAAAAAAAAAAAAEAAAAB",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAEAAAAAAAAAD0JvcnJvd2VyUHJvZmlsZQAAAAABAAAAEwAAAAEAAAAAAAAAB0t5Y1RpZXIAAAAAAQAAABMAAAAAAAAAAAAAAAZBZG1pbnMAAAAAAAAAAAAAAAAACElzUGF1c2VkAAAAAAAAAAAAAAAPTGVuZGluZ0NvbnRyYWN0AAAAAAAAAAAAAAAAC05mdENvbnRyYWN0AA==",
        "AAAAAAAAAAAAAAAKZ2V0X2FkbWlucwAAAAAAAAAAAAEAAAPqAAAAEw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABQAAAAAAAAAGYWRtaW4xAAAAAAATAAAAAAAAAAZhZG1pbjIAAAAAABMAAAAAAAAABmFkbWluMwAAAAAAEwAAAAAAAAAQbGVuZGluZ19jb250cmFjdAAAABMAAAAAAAAADG5mdF9jb250cmFjdAAAABMAAAAA",
        "AAAAAAAAAAAAAAALZ2V0X3Byb2ZpbGUAAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAB9AAAAAPQm9ycm93ZXJQcm9maWxlAA==",
        "AAAAAAAAAAAAAAALaGFzX3Byb2ZpbGUAAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAAAE=",
        "AAAAAAAAADlHZXQgdGhlIEtZQyB0aWVyIGZvciBhIGJvcnJvd2VyICgwPU5vbmUsIDE9U29mdCwgMj1GdWxsKS4AAAAAAAAMZ2V0X2t5Y190aWVyAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAAAQ=",
        "AAAAAAAAAFtTZXQgS1lDIHRpZXIuIFJlcXVpcmVzIDItb2YtMyBhZG1pbiBzaWduYXR1cmVzLgp0aWVyOiAwPU5vbmUsIDE9U29mdCAoJDUwMCksIDI9RnVsbCAoJDUwMDApAAAAAAxzZXRfa3ljX3RpZXIAAAAEAAAAAAAAAAdjYWxsZXIxAAAAABMAAAAAAAAAB2NhbGxlcjIAAAAAEwAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAAR0aWVyAAAABAAAAAA=",
        "AAAAAAAAAAAAAAANaW5pdF9ib3Jyb3dlcgAAAAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAA=",
        "AAAAAAAAADRGcmVlemUgYW4gYWNjb3VudC4gUmVxdWlyZXMgMi1vZi0zIGFkbWluIHNpZ25hdHVyZXMuAAAADmZyZWV6ZV9hY2NvdW50AAAAAAAEAAAAAAAAAAdjYWxsZXIxAAAAABMAAAAAAAAAB2NhbGxlcjIAAAAAEwAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAAZyZWFzb24AAAAAABAAAAAA",
        "AAAAAAAAAAAAAAAQYnVtcF9wcm9maWxlX3R0bAAAAAEAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAA=",
        "AAAAAAAAADZVbmZyZWV6ZSBhbiBhY2NvdW50LiBSZXF1aXJlcyAyLW9mLTMgYWRtaW4gc2lnbmF0dXJlcy4AAAAAABB1bmZyZWV6ZV9hY2NvdW50AAAAAwAAAAAAAAAHY2FsbGVyMQAAAAATAAAAAAAAAAdjYWxsZXIyAAAAABMAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAA=",
        "AAAAAgAAAAAAAAAAAAAADlJlcHV0YXRpb25UaWVyAAAAAAAFAAAAAAAAAAAAAAAETm9uZQAAAAAAAAAAAAAACEJlZ2lubmVyAAAAAAAAAAAAAAAGU2lsdmVyAAAAAAAAAAAAAAAAAARHb2xkAAAAAAAAAAAAAAAIUGxhdGludW0=",
        "AAAAAQAAAAAAAAAAAAAAD0JvcnJvd2VyUHJvZmlsZQAAAAAKAAAAAAAAAAdhZGRyZXNzAAAAABMAAAAAAAAACmNyZWF0ZWRfYXQAAAAAAAYAAAAAAAAADWRlZmF1bHRfY291bnQAAAAAAAAEAAAAAAAAAA1mcmVlemVfcmVhc29uAAAAAAAAEAAAAAAAAAAJaXNfZnJvemVuAAAAAAAAAQAAAAAAAAAKbG9hbl9jb3VudAAAAAAABAAAAAAAAAAQcmVwdXRhdGlvbl9zY29yZQAAAAsAAAAAAAAAD3JlcHV0YXRpb25fdGllcgAAAAfQAAAADlJlcHV0YXRpb25UaWVyAAAAAAAAAAAADnRvdGFsX2JvcnJvd2VkAAAAAAALAAAAAAAAAAx0b3RhbF9yZXBhaWQAAAAL",
        "AAAAAgAAAAAAAAAAAAAAD1JlcHV0YXRpb25FdmVudAAAAAAHAAAAAAAAAAAAAAAOVGVzdExvYW5SZXBhaWQAAAAAAAAAAAAAAAAAEExvYW5SZXBhaWRPblRpbWUAAAAAAAAAAAAAAA1Mb2FuUGFpZEVhcmx5AAAAAAAAAAAAAAAAAAAMTG9hbkxhdGUxRGF5AAAAAAAAAAAAAAANTG9hbkxhdGU3RGF5cwAAAAAAAAAAAAAAAAAADUxvYW5EZWZhdWx0ZWQAAAAAAAAAAAAAAAAAAAtMYXRlV2FybmluZwA=",
        "AAAAAAAAAAAAAAASY2FsY3VsYXRlX21heF9sb2FuAAAAAAABAAAAAAAAAAhib3Jyb3dlcgAAABMAAAABAAAACw==",
        "AAAAAAAAAE9VcGRhdGUgY3VtdWxhdGl2ZSBib3Jyb3dlZC9yZXBhaWQgdG90YWxzLgpPTkxZIGNhbGxhYmxlIGJ5IHRoZSBMZW5kaW5nQ29udHJhY3QuAAAAABJ1cGRhdGVfbG9hbl90b3RhbHMAAAAAAAQAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAAAAAA5ib3Jyb3dlZF9kZWx0YQAAAAAACwAAAAAAAAAMcmVwYWlkX2RlbHRhAAAACwAAAAA=",
        "AAAAAAAAAI1BcHBseSBhIHJlcHV0YXRpb24gZXZlbnQuClRvIG1heGltaXplIGRlY2VudHJhbGl6YXRpb24sIHRoaXMgY2FuIE9OTFkgYmUgY2FsbGVkIGJ5IHRoZSBMZW5kaW5nQ29udHJhY3QuCkFkbWlucyBjYW5ub3QgbWFudWFsbHkgYWRqdXN0IHNjb3Jlcy4AAAAAAAAUYWRkX3JlcHV0YXRpb25fZXZlbnQAAAADAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAFZXZlbnQAAAAAAAfQAAAAD1JlcHV0YXRpb25FdmVudAAAAAAA",
        "AAAAAAAAAAAAAAAUZ2V0X2xlbmRpbmdfY29udHJhY3QAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAXY2FsY3VsYXRlX2ludGVyZXN0X3JhdGUAAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAAAQ=" ]),
      options
    )
  }
  public readonly fromJSON = {
    pause: this.txFromJSON<null>,
        unpause: this.txFromJSON<null>,
        is_frozen: this.txFromJSON<boolean>,
        is_paused: this.txFromJSON<boolean>,
        get_admins: this.txFromJSON<Array<string>>,
        initialize: this.txFromJSON<null>,
        get_profile: this.txFromJSON<BorrowerProfile>,
        has_profile: this.txFromJSON<boolean>,
        get_kyc_tier: this.txFromJSON<u32>,
        set_kyc_tier: this.txFromJSON<null>,
        init_borrower: this.txFromJSON<null>,
        freeze_account: this.txFromJSON<null>,
        bump_profile_ttl: this.txFromJSON<null>,
        unfreeze_account: this.txFromJSON<null>,
        calculate_max_loan: this.txFromJSON<i128>,
        update_loan_totals: this.txFromJSON<null>,
        add_reputation_event: this.txFromJSON<null>,
        get_lending_contract: this.txFromJSON<string>,
        calculate_interest_rate: this.txFromJSON<u32>
  }
}
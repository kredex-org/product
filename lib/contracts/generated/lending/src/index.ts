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
    contractId: "CAJ5VLQZ2ZKOCVQKFX7LFYF36LNLCDT6QJT4STAZFQ5P23TZZ4UBEGXQ",
  }
} as const

export type DataKey = {tag: "Loan", values: readonly [u32]} | {tag: "LoanCount", values: void} | {tag: "BorrowerLoans", values: readonly [string]} | {tag: "LenderLoans", values: readonly [string]} | {tag: "Payment", values: readonly [u32, u32]} | {tag: "PaymentCount", values: readonly [u32]} | {tag: "ActiveBorrowings", values: readonly [string]} | {tag: "ActiveLendings", values: readonly [string]} | {tag: "Admins", values: void} | {tag: "IsPaused", values: void} | {tag: "UsdcToken", values: void} | {tag: "ReputationContract", values: void} | {tag: "DefaultManagementContract", values: void} | {tag: "EscrowContract", values: void} | {tag: "LiquidityPoolContract", values: void};


export interface LoanRecord {
  amount: i128;
  borrower: string;
  created_at: u64;
  due_at: u64;
  duration_days: u32;
  escrow_id: u32;
  id: u32;
  interest_rate_bps: u32;
  lender: string;
  platform_fee: i128;
  remaining_due: i128;
  status: LoanStatus;
  token: string;
  total_due: i128;
}

export type LoanStatus = {tag: "Pending", values: void} | {tag: "Approved", values: void} | {tag: "Active", values: void} | {tag: "Repaid", values: void} | {tag: "Defaulted", values: void} | {tag: "Cancelled", values: void};


export interface PaymentRecord {
  amount: i128;
  loan_id: u32;
  paid_at: u64;
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
   * Construct and simulate a get_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_loan: ({loan_id}: {loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<LoanRecord>>

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
  initialize: ({admin1, admin2, admin3, usdc_token, reputation_contract, default_management_contract, escrow_contract, liquidity_pool_contract}: {admin1: string, admin2: string, admin3: string, usdc_token: string, reputation_contract: string, default_management_contract: string, escrow_contract: string, liquidity_pool_contract: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_overdue transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_overdue: ({loan_id}: {loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_payment: ({loan_id, payment_index}: {loan_id: u32, payment_index: u32}, options?: MethodOptions) => Promise<AssembledTransaction<PaymentRecord>>

  /**
   * Construct and simulate a approve_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve_loan: ({lender, loan_id}: {lender: string, loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a days_overdue transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  days_overdue: ({loan_id}: {loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a activate_loan transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  activate_loan: ({caller1, caller2, loan_id}: {caller1: string, caller2: string, loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a bump_loan_ttl transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bump_loan_ttl: ({loan_id}: {loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a fund_from_pool transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  fund_from_pool: ({caller1, caller2, loan_id}: {caller1: string, caller2: string, loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_loan_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_loan_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_usdc_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_usdc_token: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a mark_defaulted transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mark_defaulted: ({caller, loan_id}: {caller: string, loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a record_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  record_payment: ({borrower, loan_id, amount}: {borrower: string, loan_id: u32, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<LoanStatus>>

  /**
   * Construct and simulate a revoke_approval transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  revoke_approval: ({lender, loan_id}: {lender: string, loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_lender_loans transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_lender_loans: ({lender}: {lender: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<u32>>>

  /**
   * Construct and simulate a get_payment_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_payment_count: ({loan_id}: {loan_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_borrower_loans transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_borrower_loans: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<Array<u32>>>

  /**
   * Construct and simulate a create_loan_request transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_loan_request: ({borrower, amount, duration_days}: {borrower: string, amount: i128, duration_days: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_active_lendings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_active_lendings: ({lender}: {lender: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_active_borrowings transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_active_borrowings: ({borrower}: {borrower: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

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
      new ContractSpec([ "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",
        "AAAAAAAAAAAAAAANYnVtcF9sb2FuX3R0bAAAAAAAAAEAAAAAAAAAB2xvYW5faWQAAAAABAAAAAA=",
        "AAAAAAAAAAAAAAAOZnVuZF9mcm9tX3Bvb2wAAAAAAAMAAAAAAAAAB2NhbGxlcjEAAAAAEwAAAAAAAAAHY2FsbGVyMgAAAAATAAAAAAAAAAdsb2FuX2lkAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X2xvYW5fY291bnQAAAAAAAAAAAABAAAABA==",
        "AAAAAAAAAAAAAAAOZ2V0X3VzZGNfdG9rZW4AAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAAAAAAAAObWFya19kZWZhdWx0ZWQAAAAAAAIAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAAAAAAHbG9hbl9pZAAAAAAEAAAAAA==",
        "AAAAAAAAAAAAAAAOcmVjb3JkX3BheW1lbnQAAAAAAAMAAAAAAAAACGJvcnJvd2VyAAAAEwAAAAAAAAAHbG9hbl9pZAAAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAH0AAAAApMb2FuU3RhdHVzAAA=",
        "AAAAAAAAAAAAAAAPcmV2b2tlX2FwcHJvdmFsAAAAAAIAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAAAAAAHbG9hbl9pZAAAAAAEAAAAAA==",
        "AAAAAQAAAAAAAAAAAAAADVBheW1lbnRSZWNvcmQAAAAAAAADAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAB2xvYW5faWQAAAAABAAAAAAAAAAHcGFpZF9hdAAAAAAG",
        "AAAAAAAAAAAAAAAQZ2V0X2xlbmRlcl9sb2FucwAAAAEAAAAAAAAABmxlbmRlcgAAAAAAEwAAAAEAAAPqAAAABA==",
        "AAAAAAAAAAAAAAARZ2V0X3BheW1lbnRfY291bnQAAAAAAAABAAAAAAAAAAdsb2FuX2lkAAAAAAQAAAABAAAABA==",
        "AAAAAgAAAAAAAAAAAAAAD1JlcHV0YXRpb25FdmVudAAAAAAHAAAAAAAAAAAAAAAOVGVzdExvYW5SZXBhaWQAAAAAAAAAAAAAAAAAEExvYW5SZXBhaWRPblRpbWUAAAAAAAAAAAAAAA1Mb2FuUGFpZEVhcmx5AAAAAAAAAAAAAAAAAAAMTG9hbkxhdGUxRGF5AAAAAAAAAAAAAAANTG9hbkxhdGU3RGF5cwAAAAAAAAAAAAAAAAAADUxvYW5EZWZhdWx0ZWQAAAAAAAAAAAAAAAAAAAtMYXRlV2FybmluZwA=",
        "AAAAAAAAAAAAAAASZ2V0X2JvcnJvd2VyX2xvYW5zAAAAAAABAAAAAAAAAAhib3Jyb3dlcgAAABMAAAABAAAD6gAAAAQ=",
        "AAAAAAAAAAAAAAATY3JlYXRlX2xvYW5fcmVxdWVzdAAAAAADAAAAAAAAAAhib3Jyb3dlcgAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAANZHVyYXRpb25fZGF5cwAAAAAAAAQAAAABAAAABA==",
        "AAAAAAAAAAAAAAATZ2V0X2FjdGl2ZV9sZW5kaW5ncwAAAAABAAAAAAAAAAZsZW5kZXIAAAAAABMAAAABAAAABA==",
        "AAAAAAAAAAAAAAAVZ2V0X2FjdGl2ZV9ib3Jyb3dpbmdzAAAAAAAAAQAAAAAAAAAIYm9ycm93ZXIAAAATAAAAAQAAAAQ=" ]),
      options
    )
  }
  public readonly fromJSON = {
    pause: this.txFromJSON<null>,
        unpause: this.txFromJSON<null>,
        get_loan: this.txFromJSON<LoanRecord>,
        is_paused: this.txFromJSON<boolean>,
        get_admins: this.txFromJSON<Array<string>>,
        initialize: this.txFromJSON<null>,
        is_overdue: this.txFromJSON<boolean>,
        get_payment: this.txFromJSON<PaymentRecord>,
        approve_loan: this.txFromJSON<null>,
        days_overdue: this.txFromJSON<u64>,
        activate_loan: this.txFromJSON<null>,
        bump_loan_ttl: this.txFromJSON<null>,
        fund_from_pool: this.txFromJSON<null>,
        get_loan_count: this.txFromJSON<u32>,
        get_usdc_token: this.txFromJSON<string>,
        mark_defaulted: this.txFromJSON<null>,
        record_payment: this.txFromJSON<LoanStatus>,
        revoke_approval: this.txFromJSON<null>,
        get_lender_loans: this.txFromJSON<Array<u32>>,
        get_payment_count: this.txFromJSON<u32>,
        get_borrower_loans: this.txFromJSON<Array<u32>>,
        create_loan_request: this.txFromJSON<u32>,
        get_active_lendings: this.txFromJSON<u32>,
        get_active_borrowings: this.txFromJSON<u32>
  }
}
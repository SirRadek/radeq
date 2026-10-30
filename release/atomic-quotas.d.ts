export interface QuotaStatement {
  bind(...values: unknown[]): QuotaStatement;
  all(): Promise<{success:boolean; results: Record<string,unknown>[]}>;
  run(): Promise<{success:boolean; error?:string}>;
}
export interface QuotaDatabase {
  prepare(query:string): QuotaStatement;
  batch(statements:QuotaStatement[]): Promise<Array<{success:boolean; results:Record<string,unknown>[]}>>;
}
export type QuotaResult = {status:'allowed'} | {status:'limited'; retryAfterSeconds:number} | {status:'unavailable'};
export const quotaSql: Record<'reserve'|'recipient'|'global'|'cleanup',string>;
export function reserveQuota(db:QuotaDatabase|undefined, options:{scope:'lead'|'measure';subject:string;max:number;windowSeconds:number}):Promise<QuotaResult>;
export function reserveConfirmation(db:QuotaDatabase|undefined, recipient:string):Promise<QuotaResult>;

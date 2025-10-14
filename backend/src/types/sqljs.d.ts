declare module 'sql.js' {
  export interface QueryExecResult {
    columns: string[];
    values: any[][];
  }
  export class Database {
    constructor(data?: Uint8Array);
    run(sql: string, params?: any[]): void;
    exec(sql: string): QueryExecResult[];
    prepare(sql: string): { run(params?: any[]): void };
    export(): Uint8Array;
  }
  const initSqlJs: (config?: { locateFile?: (file: string) => string }) => Promise<any>;
  export default initSqlJs;
}



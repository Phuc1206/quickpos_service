declare global {
  namespace Express {
    // Bổ sung 'token' vào interface Request gốc
    export interface Request {
      token: IToken;
    }
  }
}
export {};

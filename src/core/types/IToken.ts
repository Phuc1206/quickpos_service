interface IRequireToken {
  userId: string;
  level: string;
}

interface IToken extends IRequireToken {
  [props: string]: any;
}

export type IRefreshToken = Pick<IToken, "userId">;

export default IToken;

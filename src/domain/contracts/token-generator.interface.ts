export type TokenPayload = {
  sub: string;
  email: string;
  role: string;
};

export abstract class TokenGenerator {
  abstract generate(payload: TokenPayload): Promise<string>;
}

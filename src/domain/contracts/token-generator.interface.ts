export type TokenPayload = {
  sub: string;
  email: string;
  role: string;
}

export interface TokenGenerator {
  generate(payload: TokenPayload): Promise<string>
}
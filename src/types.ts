export type RefreshType = {
  name: string;
  token: string;
};

export type TokenType = {
  name: string;
  token: string;
};

export type FetchReturnType = {
  refreshToken: TokenType;
  accessToken: TokenType;
  data: any;
};

export type RefreshTokenResponse = {
  newAccessToken: string;
  newRefreshToken: string;
};

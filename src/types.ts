export type RefreshType = {
  name: string;
  token: string;
};

export type TokenType = {
  name: string;
  token: string;
};

export type Options = {
  base_url: string;
  access_token_name: string;
  refresh_token_name: string;
  has_authorization: boolean;
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

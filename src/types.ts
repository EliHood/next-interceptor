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
  /**
   * must match access token response name casing.
   */
  access_token_name: string;
  /**
   * must match refresh token response name casing.
   */
  refresh_token_name: string;
  refresh_url: string;
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

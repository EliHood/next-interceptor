import { cookies } from "next/headers";
import fetch from "node-fetch";
import { FetchReturnType, Options, RefreshTokenResponse } from "./types";

/**
 *
 * @todo need to delegate logic to developer, as this would be different.
 */

const refreshAccessToken = async (
  baseUrl: string,
  refreshTokenName: string
): Promise<RefreshTokenResponse> => {
  const getRefreshToken = cookies().get(refreshTokenName)?.value as string;
  const response = await fetch(`${baseUrl}/api/v1/users/refresh`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: getRefreshToken,
    },
  });

  const data: any = await response.json();

  const newAccessToken = data.token;

  const newRefreshToken = data.refresh_token;

  return { newAccessToken: newAccessToken, newRefreshToken: newRefreshToken }; // Return new access token
};

let originalFetch: any = fetch;

type NextInterceptor = (
  input: string,
  init: RequestInit
) => Promise<FetchReturnType>;

export function nextIntercepor(options: Options): NextInterceptor {
  const { base_url, access_token_name, refresh_token_name, has_authorization } =
    options;

  const BASE_URL = base_url;
  const ACCESS_TOKEN_NAME = access_token_name;
  const REFRESH_TOKEN_NAME = refresh_token_name;

  return async function fetchIntercepor(
    input: string,
    init: RequestInit = {}
  ): Promise<FetchReturnType> {
    const currentToken = cookies().get(ACCESS_TOKEN_NAME)?.value;

    if (!currentToken) return "No Access Token Provided" as any;

    const headers: Record<string, unknown> = {
      ...init.headers,
    };

    if (has_authorization) {
      headers["Authorization"] = `${currentToken}`;
    }

    const newInput = `${BASE_URL}${input}`;
    const response = await originalFetch?.(newInput, {
      ...init,
      headers,
    });

    const newResponse = await response.json();

    let retry = false;

    //Check if the response indicates an expired token (often 401 Unauthorized)
    if (
      newResponse.status === 401 &&
      !retry &&
      newResponse.message === "jwt expired"
    ) {
      // Attempt to refresh the token
      try {
        const { newAccessToken, newRefreshToken } = await refreshAccessToken(
          BASE_URL,
          options.refresh_token_name
        );

        const retryResponse = await originalFetch(newInput, {
          ...init,
          headers: {
            ...init.headers,
            Authorization: `${newAccessToken}`,
          },
        });
        const newResponse = await retryResponse.json();
        retry = true;

        return {
          refreshToken: {
            name: REFRESH_TOKEN_NAME,
            token: newRefreshToken,
          },
          accessToken: {
            name: ACCESS_TOKEN_NAME,
            token: newAccessToken,
          },
          data: newResponse,
        };
      } catch (error) {
        console.error("Failed to refresh token", error);
        throw error; // Rethrow the error for upstream handling
      }
    }

    //   If the response is ok, return the response data
    return newResponse;
  };
}

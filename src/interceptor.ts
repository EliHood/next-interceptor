import { cookies } from "next/headers";
import fetch from "node-fetch";
import { FetchReturnType, RefreshTokenResponse } from "./types";

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

type Options = {
  BASE_URL: string;
  access_token_name: string;
  refresh_token_name: string;
  has_authorization: boolean;
};

export const fetchWithInterceptor = async (
  input: string,
  options: Options,
  init: RequestInit = {}
): Promise<FetchReturnType> => {
  const currentToken = cookies().get(options.access_token_name)?.value;

  if (!currentToken) return "No Access Token Provided" as any;

  const headers: Record<string, unknown> = {
    ...init.headers,
  };

  if (options.has_authorization) {
    headers["Authorization"] = `${currentToken}`;
  }

  const newInput = `${options.BASE_URL}${input}`;
  const response = await originalFetch?.(newInput, {
    ...init,
    headers,
  });

  const newResponse = await response.json();

  let retry = false;

  console.log("MIAMI", newResponse);

  //Check if the response indicates an expired token (often 401 Unauthorized)
  if (
    newResponse.status === 401 &&
    !retry &&
    newResponse.message === "jwt expired"
  ) {
    // Attempt to refresh the token
    try {
      const { newAccessToken, newRefreshToken } = await refreshAccessToken(
        options.BASE_URL,
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
          name: options.refresh_token_name,
          token: newRefreshToken,
        },
        accessToken: {
          name: options.access_token_name,
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

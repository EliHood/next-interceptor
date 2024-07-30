import { fetchWithInterceptor } from "../interceptor";
import { CookieWrapper } from "../cookie-wrapper";
import React from "react";

export default async function Home() {
  const getUser = async () => {
    try {
      const data = await fetchWithInterceptor(
        "/api/v1/users/current_user",
        {
          BASE_URL: "http://localhost:5001",
          refresh_token_name: "refreshToken",
          access_token_name: "accessToken",
          has_authorization: true,
        },
        {
          method: "GET",
        }
      );
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const data = await getUser();
  console.log("check users", data);

  return (
    <CookieWrapper
      accessToken={data?.accessToken as any}
      refreshToken={data?.refreshToken as any}
    >
      test
    </CookieWrapper>
  );
}

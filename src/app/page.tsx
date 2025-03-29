import { nextIntercepor } from "../interceptor";
import React from "react";

const fetchInterceptor = nextIntercepor({
  base_url: "http://localhost:5001",
  refresh_token_name: "refreshToken",
  access_token_name: "accessToken",
  refresh_url: "api/v1/users/refresh",
});

export default async function Home() {
  const getUser = async () => {
    console.log("test");
    try {
      const data = await fetchInterceptor("/api/v1/users/current_user", {
        method: "GET",
        has_authorization_token: true,
      });
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return error;
    }
  };

  const data: any = await getUser();

  console.log("data", data);

  return <>test</>;
}

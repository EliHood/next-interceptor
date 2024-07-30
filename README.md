## Server Side Interceptor

### Description

Server side interceptor for server components.

### Requirements

- Next 13 or Above (App Router)

### Instructions

- `yarn add next-interceptor`

add `esmExternals: "loose"` on next config experimental.

(coming soon)

next-interceptor assumes the developer has already set a cookie on the client side after successful login...

### Example Usage

```javascript
import { CookieWrapper, nextIntercepor } from "next-interceptor";

const fetchInterceptor = nextIntercepor({
  base_url: "http://localhost:5001", // this is the base url were express server is running.
  refresh_token_name: "refreshToken", // this matches my express api response property -> refreshToken.
  access_token_name: "accessToken", // this also matches my express api response property -> accessToken.
  refresh_url: "api/v1/users/refresh", // this is the url that points to my express refresh token api.
});


export default async function Home() {
  const getUser = async () => {
    try {
      const data = await fetchInterceptor("/api/v1/users/current_user", {
        method: "GET",
        has_authorization_token: true,
      });
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const data = await getUser();
  console.log("get user", data);



  return (
    {/*
        Cookie Wrapper is responsible for setting the tokens on the client side, it will appear in the
        application cookies.
    */}
    <CookieWrapper
      accessToken={data?.accessToken as any}
      refreshToken={data?.refreshToken as any}
    >
      test
    </CookieWrapper>
  );
}
```

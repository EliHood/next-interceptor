## Server Side Interceptor

### Description

Server side interceptor for server components. Handles refresh rotation essentially.

### Requirements

- Next 13 or Above (App Router)

### Instructions

- `yarn add next-interceptor`

add `esmExternals: "loose"` on next config experimental.

(coming soon)

next-interceptor assumes:

- the developer has already set a cookie on the client side after successful login...
- the developer has an express middleware already in place to add to routes.

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

### Express server example

```javascript
export async function refresh(req: Request, res: Response) {
	try {
		const refreshToken = req.header('RefreshToken') as string; // note: Header must match RefreshToken.

		const [err, result] = await verifyToken(refreshToken, 'REFRESH_SECRET');

		if (err) {
			return auth401(res, 'invalidToken');
		}


		const dbToken = await PRISMA_DB.token.findFirst({
			where: {
				user_id: result?.id,
				expired_at: {
					gte: new Date(),
				},
			} as any,
		});

		if (!dbToken) {
			return auth401(res, 'unAuthenticated');
		}

		/**
		 * generates new access token upon every refresh request which
		 */

		const { access_token } = await signToken(result);

		return res.status(200).send({
			accessToken: access_token,
			refreshToken: refreshToken,
			status: 200,
		});
	} catch (error) {
		return auth401(res, 'expiredToken');
	}
}
```

"use server";

import { cookies } from "next/headers";

interface StoreTokenRequest {
  token: string;
  name: string;
}

export async function storeToken(request: StoreTokenRequest) {
  "use server";
  cookies().set({
    name: request.name,
    value: request.token,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}

// delete the Cookie
export async function deleteToken(data: string) {
  "use server";
  cookies().delete(data);
}

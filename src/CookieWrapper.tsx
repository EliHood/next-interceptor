"use client";

import { ReactNode, useEffect } from "react";
import { storeToken } from "./cookie";
import React from "react";

type TokenType = {
  name: string;
  token: string;
};

type CookieWrapperType = {
  children: ReactNode;
  refreshToken: TokenType;
  accessToken: TokenType;
};

function useCookie({ token, name }: TokenType): void {
  useEffect(() => {
    if (!name || token === undefined) return;
    storeToken({ name: name, token: token });
  }, [token, name]);
  return;
}

/**
 *
 * This can be used to synchronize access and refresh tokens from the server to the client.
 */

export function CookieWrapper({
  children,
  refreshToken = { name: "", token: "" },
  accessToken = { name: "", token: "" },
}: CookieWrapperType) {
  useCookie?.({
    name: refreshToken?.name,
    token: refreshToken?.token,
  });
  useCookie?.({
    name: accessToken?.name,
    token: accessToken?.token,
  });
  return <>{children}</>;
}

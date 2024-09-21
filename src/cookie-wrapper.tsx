"use client";
import { ReactNode, useEffect } from "react";
import { storeToken } from "./cookie";

type TokenType = {
  name: string;
  token: string;
};

function useCookie({ token, name }: { token: string; name: string }): void {
  useEffect(() => {
    if (!name || token === undefined) return;
    storeToken({ name: name, token: token });
  }, [token, name]);
  return;
}

export function CookieWrapper({
  children,
  refreshToken = { name: "", token: "" },
  accessToken = { name: "", token: "" },
}: {
  children: ReactNode;
  refreshToken: TokenType;
  accessToken: TokenType;
}) {
  useCookie?.({ name: refreshToken?.name, token: refreshToken?.token });
  useCookie?.({ name: accessToken?.name, token: accessToken?.token });
  return <>{children}</>;
}

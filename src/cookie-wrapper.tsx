"use client";
import { ReactNode } from "react";
import { useCookie } from "./useCookie";

type TokenType = {
  name: string;
  token: string;
};

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

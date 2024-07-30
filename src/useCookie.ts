"use client";
import { useEffect } from "react";
import { setCookie } from "cookies-next";

export function useCookie({
  token,
  name,
}: {
  token: string;
  name: string;
}): void {
  useEffect(() => {
    if (!name || token === undefined) return;
    setCookie(name, token);
  }, [token]);
  return;
}

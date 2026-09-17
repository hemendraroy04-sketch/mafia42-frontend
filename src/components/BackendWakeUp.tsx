"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";

export default function BackendWakeUp() {
  useEffect(() => {
    api("/").catch(() => {});
  }, []);

  return null;
}
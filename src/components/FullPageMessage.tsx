import type { ReactNode } from "react";

export default function FullPageMessage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-black">
      {children}
    </main>
  );
}
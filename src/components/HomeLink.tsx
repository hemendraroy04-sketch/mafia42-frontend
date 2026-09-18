import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HomeLink() {
  return (
    <Link
      href="/"
      className="group -ml-3 mb-4 bg-black inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-white transition hover:bg-gray-100 hover:text-black active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      Home
    </Link>
  );
}
import Link from "next/link";

export default function HomeLink() {
  return (
    <Link
      href="/"
      className="mb-6 inline-block text-sm text-gray-500 transition hover:text-black active:text-gray-700"
    >
      ← Home
    </Link>
  );
}
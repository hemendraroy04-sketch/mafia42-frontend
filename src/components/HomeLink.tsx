import Link from "next/link";

export default function HomeLink() {
  return (
    <Link
      href="/"
      className="mb-6 inline-block text-sm text-gray-400 transition hover:text-white"
    >
      ← Home
    </Link>
  );
}
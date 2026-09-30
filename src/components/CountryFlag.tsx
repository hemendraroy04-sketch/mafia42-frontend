import Image from "next/image";
import { Globe2 } from "lucide-react";

export default function CountryFlag({ country }: { country: string }) {
  const code = country.toLowerCase();

  return (
    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-gray-200">
      {code === "none" ? (
        <Globe2 className="h-full w-full p-1.5 text-gray-500" />
      ) : (
        <Image
          src={`https://hatscripts.github.io/circle-flags/flags/${code}.svg`}
          alt={country}
          fill
          sizes="28px"
        />
      )}
    </div>
  );
}
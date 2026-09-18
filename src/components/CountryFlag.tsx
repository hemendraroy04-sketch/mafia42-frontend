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
          src={`https://flagcdn.com/w80/${code}.png`}
          alt={country}
          fill
          sizes="28px"
          className="object-cover"
        />
      )}
    </div>
  );
}
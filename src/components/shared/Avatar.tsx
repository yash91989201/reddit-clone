import Image from "next/image";

interface Props {
  seed: string;
  large?: boolean;
}

export default function Avatar({ seed, large }: Props): JSX.Element {
  return (
    <div
      className={`relative rounded-full mx-1 sm:mx-3 ${
        large ? "w-16" : "w-12"
      } aspect-square border bg-white overflow-hidden`}
    >
      <Image
        src={`https://avatars.dicebear.com/api/open-peeps/${
          seed || "placeholder"
        }.svg`}
        alt="user avatar"
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}

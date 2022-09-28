import Image from "next/image";
import { useUserData } from "@nhost/nextjs"

const Avatar = () => {
    const userData = useUserData();
    return (
        <div className="relative rounded-full mx-3  w-12 aspect-square border bg-white overflow-hidden">
            <Image
                src={`https://avatars.dicebear.com/api/open-peeps/${userData?.displayName || "placeholder"}.svg`}
                alt="user avatar"
                layout="fill"
                objectFit="contain"
            />
        </div>
    )
}

export default Avatar
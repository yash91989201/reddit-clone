import Image from 'next/image';

interface AvatarProps {
    seed: string
}

const Avatar = ({ seed }: AvatarProps) => {
    return (
        <div className="relative rounded-full mx-3  w-12 aspect-square border bg-white overflow-hidden">
            <Image
                src={`https://avatars.dicebear.com/api/open-peeps/${seed || "placeholder"}.svg`}
                alt="user avatar"
                layout="fill"
                objectFit="contain"
            />
        </div>
    )
}

export default Avatar
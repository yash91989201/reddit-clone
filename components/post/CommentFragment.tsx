import React from 'react'
import ReactTimeago from 'react-timeago'
// CUSTOM COMPONENTS
import Avatar from 'components/shared/Avatar'
// import types
import { CommentType } from 'typings'
// import icons
import { HiHeart, HiOutlineHeart, HiPencil, HiTrash, HiReply } from "react-icons/hi"
import { IconType } from 'react-icons/lib'

interface Props {
    comment: CommentType
}

export default function CommentFragment({ comment }: Props): JSX.Element {

    // const child_comments=

    return <div className='py-3  flex flex-col border rounded space-x-3'>
        <div className='flex justify-between items-center '>
            <div className="flex items-center  ">
                <Avatar seed={comment.user.displayName} />
                <span>{comment.user.displayName}</span>
            </div>
            <ReactTimeago date={comment.created_at} minPeriod={3600} className='px-3 text-gray-500 text-xs sm:text-sm' />
        </div>
        <p className='px-5 py-3 text-sm sm:text-base'>{comment.text}</p>
        {/* comment actions */}
        <div className='flex items-center text-base  sm:text-lg space-x-3'>
            <IconBtn Icon={HiHeart} className='flex items-center space-x-1'>0</IconBtn>
            <IconBtn Icon={HiReply} className='flex items-center text-purple-500 space-x-1' />
            <IconBtn Icon={HiPencil} className='flex items-center space-x-1' />
            <IconBtn Icon={HiTrash} className='flex items-center text-red-500  space-x-1' />
        </div>
    </div>

}

interface IconBtnProps {
    Icon: IconType,
    className?: string,
    children?: JSX.Element | string,
    isActive?: boolean,
}

function IconBtn({ Icon, isActive, children, className, ...props }: IconBtnProps): JSX.Element {
    return <button className={`${className}`} {...props}>
        <span>
            <Icon />
        </span>
        {children}
    </button>
}
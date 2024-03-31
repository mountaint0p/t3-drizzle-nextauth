import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
dayjs.extend(relativeTime);

// type PostWithUser = RouterOutputs["post"]["getAll"][number];
type PostWithAuthor = RouterOutputs["post"]["getAllWithAuthor"][number];
export const PostView = (props: PostWithAuthor) => {
  const { post, user } = props;
  return (
    <div
      key={post.id}
      className="flex content-center gap-3 border-b border-slate-400 p-4"
    >
      <Image
        src={user.image as string}
        className="h-12 w-12 rounded-full"
        alt={`${user.name} profile picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col content-center">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/profile/${user.id}`}>
            <span>{`@${user.name}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{`· ${dayjs(
              post.createdAt,
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

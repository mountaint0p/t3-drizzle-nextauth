import Link from "next/link";
import { PostView } from "~/components/postView";
import { PageLayout } from "~/components/layout";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

import { CreatePostWizard } from "~/app/createPostWizard";

async function LoginControl() {
  const session = await getServerAuthSession();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session.user?.name}</span>}
      </p>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
    </div>
  );
}

async function Feed() {
  const data = await api.post.getAllWithAuthor();
  if (!data) return <div>No data</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
}

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <>
      <PageLayout>
        <LoginControl />
        <CreatePostWizard session={session} />
        <Feed />
      </PageLayout>
    </>
  );
}

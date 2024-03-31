import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await api.post.getByPostId({ postId: Number(params.slug) });
  console.log(data);
  if (!data) return <div>No data</div>;

  return (
    <PageLayout>
      <div className="flex flex-col">
        {data?.map((fullPost) => (
          <PostView {...fullPost} key={fullPost.post.id} />
        ))}
      </div>
    </PageLayout>
  );
}

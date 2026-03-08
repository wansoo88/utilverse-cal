import { PostStatus } from "@prisma/client";
import { generateDraftAction, updatePostStatusAction } from "@/app/actions";
import { getReviewPosts } from "@/lib/services/post-service";

export default async function ReviewPage() {
  const posts = await getReviewPosts();

  return (
    <div className="section-stack">
      {posts.map((post) => (
        <section key={post.id} className="panel">
          <p className="label">{post.category}</p>
          <h2>{post.title}</h2>
          <p className="small-note">
            {post.keyword?.keyword ?? "No keyword"} · {post.targetCountry}
          </p>
          <div className="actions">
            <form action={generateDraftAction}>
              <input type="hidden" name="postId" value={post.id} />
              <button className="button-link" type="submit">
                Regenerate with Gemini
              </button>
            </form>
            <form action={updatePostStatusAction}>
              <input type="hidden" name="postId" value={post.id} />
              <input type="hidden" name="status" value={PostStatus.APPROVED} />
              <button className="button-link primary" type="submit">
                Approve
              </button>
            </form>
            <form action={updatePostStatusAction}>
              <input type="hidden" name="postId" value={post.id} />
              <input type="hidden" name="status" value={PostStatus.QUEUED} />
              <button className="button-link" type="submit">
                Send back to queue
              </button>
            </form>
          </div>
          <pre className="draft-preview">{post.draftMarkdown ?? "Draft not generated yet."}</pre>
        </section>
      ))}
      {!posts.length ? (
        <section className="panel">
          <p className="label">Review queue</p>
          <p>No posts are waiting for review.</p>
        </section>
      ) : null}
    </div>
  );
}

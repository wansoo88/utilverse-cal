import { PostStatus } from "@prisma/client";
import { generateDraftAction, updatePostStatusAction } from "@/app/actions";
import { listPostsByStatus } from "@/lib/services/post-service";

const columns = [
  PostStatus.QUEUED,
  PostStatus.REVIEW,
  PostStatus.APPROVED,
  PostStatus.SCHEDULED,
  PostStatus.PUBLISHED,
];

export default async function PipelinePage() {
  const posts = await listPostsByStatus();

  return (
    <section className="panel">
      <p className="label">Pipeline board</p>
      <div className="pipeline-board">
        {columns.map((status) => (
          <section key={status} className="pipeline-column">
            <h3>{status}</h3>
            <div className="pipeline-stack">
              {posts
                .filter((post) => post.status === status)
                .map((post) => (
                  <article key={post.id} className="pipeline-card">
                    <strong>{post.title}</strong>
                    <p className="small-note">
                      {post.category} · {post.targetCountry}
                    </p>
                    <p className="small-note">
                      {post.keyword?.keyword ?? "No linked keyword"}
                    </p>
                    {status === PostStatus.QUEUED ? (
                      <form action={generateDraftAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button className="button-link primary" type="submit">
                          Generate draft
                        </button>
                      </form>
                    ) : null}
                    {status === PostStatus.REVIEW ? (
                      <form action={updatePostStatusAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="status" value={PostStatus.APPROVED} />
                        <button className="button-link" type="submit">
                          Approve
                        </button>
                      </form>
                    ) : null}
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

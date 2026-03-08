import { PostStatus } from "@prisma/client";
import { publishPostAction, schedulePostAction, updatePostStatusAction } from "@/app/actions";
import { getPublishPosts } from "@/lib/services/post-service";

export default async function PublishPage() {
  const posts = await getPublishPosts();

  return (
    <section className="panel">
      <p className="label">Publish queue</p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Scheduled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <strong>{post.title}</strong>
                  <div className="small-note">{post.keyword?.keyword ?? "No keyword"}</div>
                </td>
                <td>{post.status}</td>
                <td>
                  {post.publishJobs[0]?.scheduledFor
                    ? new Date(post.publishJobs[0].scheduledFor).toLocaleString()
                    : "Not scheduled"}
                </td>
                <td>
                  <div className="actions">
                    {post.status === PostStatus.APPROVED ? (
                      <form action={schedulePostAction} className="inline-form">
                        <input type="hidden" name="postId" value={post.id} />
                        <input className="input" name="scheduledFor" type="datetime-local" required />
                        <button className="button-link primary" type="submit">
                          Schedule
                        </button>
                      </form>
                    ) : null}
                    {post.status === PostStatus.SCHEDULED ? (
                      <form action={publishPostAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <button className="button-link" type="submit">
                          Publish to Blogger
                        </button>
                      </form>
                    ) : null}
                    {post.status === PostStatus.PUBLISHED && post.bloggerUrl ? (
                      <a className="button-link" href={post.bloggerUrl} target="_blank">
                        Open live post
                      </a>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

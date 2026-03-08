import { Category, Country } from "@prisma/client";
import { createKeywordAction, createPostFromKeywordAction, seedPipelineAction } from "@/app/actions";
import { listKeywords } from "@/lib/services/keyword-service";

export default async function KeywordsPage() {
  const keywords = await listKeywords();

  return (
    <div className="section-stack">
      <section className="grid grid-2">
        <article className="panel">
          <p className="label">Add keyword</p>
          <form action={createKeywordAction} className="form-grid">
            <input className="input" name="keyword" placeholder="best free ai tools for office workers" required />
            <div className="grid grid-2">
              <select className="input" name="category" defaultValue={Category.AI_PRODUCTIVITY}>
                {Object.values(Category).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select className="input" name="country" defaultValue={Country.US}>
                {Object.values(Country).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-2">
              <input className="input" name="intent" defaultValue="informational" />
              <input className="input" name="priority" type="number" min="1" max="5" defaultValue="3" />
            </div>
            <textarea className="input textarea" name="notes" placeholder="Optional notes or angle" />
            <button className="button-link primary" type="submit">
              Save keyword
            </button>
          </form>
        </article>

        <article className="panel">
          <p className="label">Pipeline bootstrap</p>
          <p>
            Create queued posts for every keyword that does not yet have a linked
            post record.
          </p>
          <form action={seedPipelineAction}>
            <button className="button-link" type="submit">
              Generate post records from keywords
            </button>
          </form>
        </article>
      </section>

      <section className="panel">
        <p className="label">Keyword queue</p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Category</th>
                <th>Country</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword) => (
                <tr key={keyword.id}>
                  <td>{keyword.keyword}</td>
                  <td>{keyword.category}</td>
                  <td>{keyword.country}</td>
                  <td>{keyword.status}</td>
                  <td>{keyword.priority}</td>
                  <td>
                    {keyword.posts.length ? (
                      <span className="small-note">Post linked</span>
                    ) : (
                      <form action={createPostFromKeywordAction}>
                        <input type="hidden" name="keywordId" value={keyword.id} />
                        <button className="button-link" type="submit">
                          Create post
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

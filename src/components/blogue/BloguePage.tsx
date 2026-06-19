import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function BloguePage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    limit: 100,
    depth: 1,
    sort: '-publishedAt',
  })

  return (
    <main className="bg-white text-zinc-950">
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="font-semibold text-red-300">Blogue santé</p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Articles sur les douleurs, la posture et les habitudes santé.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200">
            Des contenus simples et utiles pour mieux comprendre certaines conditions, les signes à
            surveiller et les bonnes habitudes à intégrer au quotidien.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {posts.docs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((post: any) => {
              const title = post.title
              const slug = post.slug
              const description =
                post.meta?.description ||
                'Lire cet article du blogue de Chiropratique St-Roch.'

              return (
                <article
                  key={post.id}
                  className="flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
                      Article
                    </p>

                    <h2 className="mt-3 text-2xl font-bold">{title}</h2>

                    <p className="mt-4 leading-7 text-zinc-600">
                      {description}
                    </p>
                  </div>

                  <a
                    href={`/blogue/${slug}`}
                    className="mt-8 rounded-full border border-zinc-300 px-5 py-3 text-center font-semibold transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
                  >
                    Lire l’article
                  </a>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-zinc-100 p-10 text-center">
            <h2 className="text-2xl font-bold">Aucun article publié pour le moment.</h2>
            <p className="mt-3 text-zinc-600">
              Ajoute des articles dans la section Posts de l’admin Payload.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
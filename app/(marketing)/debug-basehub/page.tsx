import { getFeatures } from "@/lib/queries"
import { basehubClient } from "@/lib/basehub"
import { draftMode } from "next/headers"

export default async function DebugBaseHubPage() {
  const { isEnabled } = await draftMode()
  
  // Test direct query
  let directQueryResult: any = null
  let directQueryError: any = null
  
  try {
    const client = basehubClient(isEnabled)
    directQueryResult = await client.query({
      marketingSite: {
        _structure: true,
        features: {
          _args: true,
          items: {
            _id: true,
            _title: true,
            name: true,
            slug: true,
            tagline: true,
          },
        },
      },
    })
  } catch (error) {
    directQueryError = error
  }

  // Test using getFeatures
  const features = await getFeatures()

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">BaseHub Debug Page</h1>
      
      <div className="space-y-8">
        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Environment</h2>
          <ul className="space-y-2 text-sm font-mono">
            <li>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
            </li>
            <li>
              <strong>BASEHUB_TOKEN:</strong>{" "}
              {process.env.BASEHUB_TOKEN
                ? `${process.env.BASEHUB_TOKEN.substring(0, 10)}...`
                : "NOT SET"}
            </li>
            <li>
              <strong>BASEHUB_API_TOKEN:</strong>{" "}
              {process.env.BASEHUB_API_TOKEN
                ? `${process.env.BASEHUB_API_TOKEN.substring(0, 10)}...`
                : "NOT SET"}
            </li>
            <li>
              <strong>Draft Mode:</strong> {isEnabled ? "Enabled" : "Disabled"}
            </li>
          </ul>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Direct Query Result</h2>
          {directQueryError ? (
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded">
              <p className="text-red-800 dark:text-red-200 font-semibold">Error:</p>
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(
                  {
                    message: directQueryError instanceof Error ? directQueryError.message : String(directQueryError),
                    stack: directQueryError instanceof Error ? directQueryError.stack : undefined,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          ) : (
            <pre className="text-xs overflow-auto bg-white dark:bg-gray-900 p-4 rounded">
              {JSON.stringify(directQueryResult, null, 2)}
            </pre>
          )}
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">getFeatures() Result</h2>
          <p className="mb-2">
            <strong>Count:</strong> {features.length}
          </p>
          {features.length > 0 ? (
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature._id} className="bg-white dark:bg-gray-900 p-4 rounded">
                  <p>
                    <strong>Name:</strong> {feature.name}
                  </p>
                  <p>
                    <strong>Slug:</strong> {feature.slug}
                  </p>
                  <p>
                    <strong>Tagline:</strong> {feature.tagline}
                  </p>
                  <p>
                    <strong>ID:</strong> {feature._id}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-600 dark:text-yellow-400">
              No features found. Check the console logs for more details.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

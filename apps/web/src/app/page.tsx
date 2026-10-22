import { Suspense } from "react";
import { BackendStatus } from "./backend-status";

export default function Home() {
  return (
    <main id="main" className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-3xl font-bold">Ramp</h1>
      <p className="mt-3 max-w-2xl text-neutral-700 dark:text-neutral-300">
        Ramp takes a website URL and a GitHub repository, finds accessibility
        bugs, edits the source, proves each edit worked, and opens one pull
        request for a human to review and merge. This is the initial skeleton;
        the pipeline is not implemented yet.
      </p>

      <section
        aria-labelledby="api-status-heading"
        className="mt-8 rounded-lg border border-neutral-300 p-5 dark:border-neutral-700"
      >
        <h2 id="api-status-heading" className="text-lg font-semibold">
          API connection
        </h2>
        <Suspense
          fallback={
            <p role="status" className="mt-3 font-medium">
              Checking…
            </p>
          }
        >
          <BackendStatus />
        </Suspense>
      </section>
    </main>
  );
}

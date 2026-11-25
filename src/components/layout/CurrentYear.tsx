import { cacheLife } from "next/cache";

/**
 * Copyright year. Cached (Cache Components) and revalidated daily, so the
 * static shell never freezes the build-time year and nothing runs on the client.
 */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

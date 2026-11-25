"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Copyright year, read in the browser so prerendered and statically exported
 * pages never freeze the build year. Renders nothing on the server.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => null);
  return <>{year}</>;
}

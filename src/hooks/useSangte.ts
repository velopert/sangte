import { useSyncExternalStore } from "use-sync-external-store/shim";
import { Sangte } from "../lib/sangte";
import { useSangteStore } from "./useSangteStore";

export function useSangte<T>(sangte: Sangte<T>) {
  const store = useSangteStore(sangte);
  const state = useSyncExternalStore(store.subscribe, store.getState);
  return [state, store.setState] as const;
}

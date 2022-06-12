import { useSyncExternalStore } from "use-sync-external-store/shim";
import { Sangte } from "../lib/sangte";
import { useSangteStore } from "./useSangteStore";

export function useSangteSelector<T, S>(
  sangte: Sangte<T>,
  selector: (state: T) => S
) {
  const store = useSangteStore(sangte);
  const state = useSyncExternalStore(store.subscribe, () =>
    selector(store.getState())
  );
  return state;
}

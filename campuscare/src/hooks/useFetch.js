import { useEffect, useState } from "react";

/**
 * Reusable fetch hook with Loading / Success / Error states
 * and AbortController cleanup to avoid race conditions.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  function retry() {
    setReloadKey((k) => k + 1);
  }

  useEffect(() => {
    const ctrl = new AbortController();
    let active = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetcher(ctrl.signal);
        if (active) setData(result);
      } catch (err) {
        if (err?.name === "AbortError") return;
        if (active) {
          setError(err?.message || "Something went wrong");
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { data, loading, error, retry };
}

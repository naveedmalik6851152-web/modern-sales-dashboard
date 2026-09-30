import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribeToChanges } from '@/services/api';

/**
 * Run an async loader and track its state.
 * - `loading` is true only until the first result arrives (skeletons).
 * - `refreshing` is true while re-fetching with data already on screen.
 * - Re-runs when `deps` change and (optionally) after any API mutation.
 */
export function useAsync(loader, deps = [], { refreshOnChange = true } = {}) {
  const [state, setState] = useState({ data: null, error: null, pending: true });
  const loaderRef = useRef(loader);
  const requestId = useRef(0);

  useEffect(() => {
    loaderRef.current = loader;
  });

  const run = useCallback(async ({ silent = false } = {}) => {
    const id = ++requestId.current;
    if (!silent) setState((s) => ({ ...s, pending: true, error: null }));
    try {
      const data = await loaderRef.current();
      if (id === requestId.current) setState({ data, error: null, pending: false });
    } catch (error) {
      if (id === requestId.current) setState((s) => ({ ...s, error, pending: false }));
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void run(), deps);

  useEffect(() => {
    if (!refreshOnChange) return undefined;
    return subscribeToChanges(() => run({ silent: true }));
  }, [refreshOnChange, run]);

  useEffect(
    () => () => {
      requestId.current += 1;
    },
    [],
  );

  return {
    data: state.data,
    error: state.error,
    loading: state.pending && state.data == null,
    refreshing: state.pending && state.data != null,
    reload: run,
  };
}

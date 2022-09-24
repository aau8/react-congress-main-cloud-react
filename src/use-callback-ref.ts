import { useRef, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;

/**
 * Convert an unstable function reference into a function wrapper with stable reference that
 * calls the latest instance of unstable function
 */
export function useCallbackRef<T extends AnyFunction>(unstableFn?: T): AnyFunction {
  const ref = useRef(unstableFn);
  ref.current = unstableFn;
  return useCallback((...args: Parameters<T>) => ref.current?.(...args), [ref]);
}

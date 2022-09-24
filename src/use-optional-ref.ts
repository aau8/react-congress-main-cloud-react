import { RefCallback, RefObject, useRef } from 'react';

export function useOptionalRef<T>(ref?: RefCallback<T>): RefCallback<T>;
export function useOptionalRef<T>(ref?: RefObject<T>): RefObject<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOptionalRef<T>(ref?: any): any {
  const newRef = useRef<T>(null);
  return ref ?? newRef;
}

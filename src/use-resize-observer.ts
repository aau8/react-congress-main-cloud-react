import { RefObject, useCallback, useEffect, useState } from 'react';
import { useOptionalRef } from './use-optional-ref';

export type UseResizeObserverSize = {
  width: number;
  height: number;
};
export type UseResizeObserverOptions<El extends Element = Element> = {
  width?: number;
  height?: number;
  ref?: RefObject<El>;
  onResize?: (size: UseResizeObserverSize) => void;
};
export type UseResizeObserverReturn<El extends Element = Element> = UseResizeObserverSize & {
  ref: RefObject<El>;
};

export function useResizeObserver<El extends Element = Element>({
  ref,
  width = 100,
  height = 100,
  onResize,
}: UseResizeObserverOptions<El> = {}): UseResizeObserverReturn<El> {
  const el = useOptionalRef<El>(ref);
  const [size, setSize] = useState<UseResizeObserverSize>({
    width,
    height,
  });

  const updateSize = useCallback(
    (size: UseResizeObserverSize) => {
      setSize(size);
      onResize?.(size);
    },
    [onResize]
  );

  // Update the dimensions
  useEffect(() => {
    if (!el.current) return undefined;

    const { clientWidth, clientHeight } = el.current;
    updateSize({ width: clientWidth, height: clientHeight });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          updateSize({ width: contentBoxSize.inlineSize, height: contentBoxSize.blockSize });
        }
      }
    });

    observer.observe(el.current);
    return () => {
      observer.disconnect();
    };
  }, [el, updateSize]);

  return { ref: el, ...size };
}

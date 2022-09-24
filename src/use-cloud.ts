import { Cloud, CloudOptions, CloudPoint } from '@alesmenzel/cloud';
import { useEffect, useMemo, useState } from 'react';
import { useCallbackRef } from './use-callback-ref';

export type Timeout = ReturnType<typeof setTimeout>;
export type UseCloudPoint<Item> = CloudPoint & {
  index: number;
  item: Item;
};
export type UseCloudReturn<Item> = {
  cloud: Cloud<Item>;
  points: UseCloudPoint<Item>[];
  allCalculated: boolean;
};
export type UseCloudOptions<Item> = CloudOptions<Item> & {
  items: Item[];
  delay?: number;
  transform?: (item: Item) => Item;
  onInvalidPlacement?: (item: Item) => CloudPoint | null;
};

export function useCloud<Item>(options: UseCloudOptions<Item>): UseCloudReturn<Item> {
  const [points, setPoints] = useState<UseCloudPoint<Item>[]>([]);
  const [cloud] = useState(() => new Cloud<Item>(options));
  const [allCalculated, setAllCalculated] = useState(!options.items.length);

  const {
    width,
    height,
    items,
    delay,
    transform,
    onInvalidPlacement,
    randomizer,
    collider,
    attempts,
  } = options;

  const transformStable = useCallbackRef(transform);
  const onInvalidPlacementStable = useCallbackRef(onInvalidPlacement);

  // Calculate the item positions
  useEffect(() => {
    if (!items.length) {
      setAllCalculated(false);
      setPoints([]);
      return undefined;
    }

    setAllCalculated(false);
    setPoints([]);
    cloud.update({ width, height, attempts, randomizer, collider });

    let i = 0;
    let animationHandle: number;
    let timeout: Timeout;

    function calculate() {
      const item = transformStable ? transformStable(items[i]) : items[i];

      let point = cloud.next(item);

      if (!point && onInvalidPlacementStable) {
        point = onInvalidPlacementStable(item);
      }

      if (point) {
        const newPoint: UseCloudPoint<Item> = { index: i, ...point, item };
        setPoints((points) => [...points, newPoint]);
      }

      i += 1;
      if (i < items.length) {
        if (delay !== undefined) {
          timeout = setTimeout(() => {
            animationHandle = requestAnimationFrame(calculate);
          }, delay);
        } else {
          animationHandle = requestAnimationFrame(calculate);
        }
      } else {
        setAllCalculated(true);
      }
    }

    animationHandle = requestAnimationFrame(calculate);

    return () => {
      cancelAnimationFrame(animationHandle);
      clearTimeout(timeout);
    };
  }, [
    items,
    cloud,
    delay,
    width,
    height,
    attempts,
    transformStable,
    onInvalidPlacementStable,
    collider,
    randomizer,
  ]);

  return useMemo<UseCloudReturn<Item>>(
    () => ({
      cloud,
      points,
      setPoints,
      allCalculated,
    }),
    [cloud, points, allCalculated]
  );
}

import { Cloud, CloudOptions, CloudPoint } from '@alesmenzel/cloud';
export declare type Timeout = ReturnType<typeof setTimeout>;
export declare type UseCloudPoint<Item> = CloudPoint & {
    index: number;
    item: Item;
};
export declare type UseCloudReturn<Item> = {
    cloud: Cloud<Item>;
    points: UseCloudPoint<Item>[];
    allCalculated: boolean;
};
export declare type UseCloudOptions<Item> = CloudOptions<Item> & {
    items: Item[];
    delay?: number;
    transform?: (item: Item) => Item;
    onInvalidPlacement?: (item: Item) => CloudPoint | null;
};
export declare function useCloud<Item>(options: UseCloudOptions<Item>): UseCloudReturn<Item>;
//# sourceMappingURL=use-cloud.d.ts.map
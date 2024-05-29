import { RefObject } from 'react';
export declare type UseResizeObserverSize = {
    width: number;
    height: number;
};
export declare type UseResizeObserverOptions<El extends Element = Element> = {
    width?: number;
    height?: number;
    ref?: RefObject<El>;
    onResize?: (size: UseResizeObserverSize) => void;
};
export declare type UseResizeObserverReturn<El extends Element = Element> = UseResizeObserverSize & {
    ref: RefObject<El>;
};
export declare function useResizeObserver<El extends Element = Element>({ ref, width, height, onResize, }?: UseResizeObserverOptions<El>): UseResizeObserverReturn<El>;
//# sourceMappingURL=use-resize-observer.d.ts.map
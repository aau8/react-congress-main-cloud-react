export declare type AnyFunction = (...args: any[]) => any;
/**
 * Convert an unstable function reference into a function wrapper with stable reference that
 * calls the latest instance of unstable function
 */
export declare function useCallbackRef<T extends AnyFunction>(unstableFn?: T): AnyFunction;
//# sourceMappingURL=use-callback-ref.d.ts.map
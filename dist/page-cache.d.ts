/** Route metadata used by the child page cache, independent of a router or UI. */
export interface MicroPageRoute {
    name?: string | symbol | null;
    path: string;
    meta?: {
        parentName?: unknown;
        keepAlive?: unknown;
        title?: unknown;
    };
}
export interface MicroPageCacheState {
    keepAliveList: string[];
    visitedFullPaths: string[];
    refreshKeys: Record<string, number>;
    navigationSeq: number;
    pageKeys: Record<string, number>;
}
export declare function createMicroPageCacheState(): MicroPageCacheState;
/** Full paths own instances; component names only control KeepAlive's include list. */
export declare class MicroPageCache {
    private routes;
    readonly state: MicroPageCacheState;
    constructor(routes: readonly MicroPageRoute[], state?: MicroPageCacheState);
    ancestorNames(name: string | symbol): string[];
    private cacheable;
    sync(name: string | symbol, fullPath: string, options?: {
        ancestors?: Record<string, string>;
        tabFullPaths?: readonly string[];
        tabSwitch?: boolean;
    }): void;
    enter(fullPath: string): void;
    close(name: string | symbol, path: string): void;
    refresh(fullPath: string): void;
    key(fullPath: string): string;
    reset(): void;
}

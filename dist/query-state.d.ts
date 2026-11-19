import type { RouteQuery } from './route';
/**
 * query 旁路状态存储。
 *
 * 为什么需要它：页签库（如 @melt-js/libs-qiankun2-tabs-vue3）用
 * `viewUrl + stableStringify(viewProps)` 做页签去重。query 一旦放进 viewProps，
 * /x?id=1 和 /x?id=2 就会被判定为两个不同页签，而 qiankun 底层只有一个微应用实例，
 * 导致两个页签互相抢同一个实例的路由状态。
 *
 * 解决办法：viewProps 里只放「路径身份」这类稳定字段，query 存到这里，
 * 由页签组件按 identity 反查。这样同一路径的 query 变化会命中同一个页签。
 */
export type QueryListener = (query: RouteQuery, fullPath: string) => void;
export interface QueryStateSnapshot {
    identity: string;
    query: RouteQuery;
    fullPath: string;
}
/**
 * query 状态存储。框架无关，Vue 3 版会把它包成 reactive / composable。
 */
export declare class QueryStateStore {
    private entries;
    private ensure;
    /**
     * 写入某个页签身份对应的 query，并通知订阅者。
     *
     * path 用于拼回 fullPath；如果不传，会尝试从 identity 解析路径。
     * 返回值表示状态是否真的发生了变化。
     */
    set(identity: string, query: RouteQuery | undefined | null, path?: string): boolean;
    /**
     * 推断某个 identity 对应的路径。
     *
     * identity 形如 'appName::/app2/user'，取 '::' 之后的部分。
     * 如果 identity 不是这个格式，就退回已记录的 fullPath。
     */
    private resolvePathOf;
    /**
     * 用 fullPath 同时写入路径和 query。
     *
     * 路径变化时 identity 也会变（调用方负责切换 identity），
     * 这里只负责把 query 落到对应的 identity 上。
     */
    setFromFullPath(identity: string, fullPath: string): boolean;
    /** 读取 query */
    get(identity: string): RouteQuery;
    /** 读取 fullPath（路径 + query） */
    getFullPath(identity: string): string;
    /** 读取当前路径（不含 query） */
    getPath(identity: string): string;
    /**
     * 订阅某个 identity 的 query 变化，返回取消订阅函数。
     */
    subscribe(identity: string, listener: QueryListener): () => void;
    /** 移除某个 identity 的状态（页签关闭时调用） */
    remove(identity: string): void;
    /** 清空 */
    clear(): void;
    /** 导出当前全部状态快照 */
    snapshot(): QueryStateSnapshot[];
}
/** 默认全局实例 */
export declare const queryState: QueryStateStore;

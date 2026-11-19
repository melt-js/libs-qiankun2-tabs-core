import type { RouteQuery } from './route';
/**
 * 路由事件分发器。
 *
 * 主应用和微应用之间的「路由意图」都收敛到这里：
 * - 主应用打开页签 -> dispatch('open')
 * - 微应用内部跳转 -> dispatch('navigate')
 * - 页签关闭 -> dispatch('close')
 */
export type RouteIntent = 'open' | 'navigate' | 'close' | 'refresh';
export interface RouteDispatchPayload {
    /** 微应用名，主应用页面为空 */
    appName?: string;
    /** 目标完整路径（含 query） */
    fullPath: string;
    /** 路径身份（不含 query） */
    path: string;
    /** query */
    query: RouteQuery;
}
export type RouteDispatchHandler = (payload: RouteDispatchPayload, intent: RouteIntent) => void | Promise<void>;
export declare class RouteDispatcher {
    private handlers;
    /** 订阅某个意图 */
    on(intent: RouteIntent, handler: RouteDispatchHandler): () => void;
    /**
     * 派发一次路由意图。
     *
     * 会自动把 fullPath 拆成 path / query，处理器不需要重复解析。
     */
    dispatch(intent: RouteIntent, fullPath: string, appName?: string): Promise<void>;
}
/** 默认全局分发器 */
export declare const routeDispatcher: RouteDispatcher;

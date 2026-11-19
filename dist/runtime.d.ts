import { normalizePath } from './route';
import type { RouteQuery } from './route';
/**
 * 从任意异常值里提取可读的错误信息。
 */
export declare function extractErrorMessage(error: unknown): string;
/**
 * qiankun 微应用保活运行时。
 *
 * 设计要点：
 *
 * 1. 一个微应用 = 一个 qiankun 实例。多个页签共享同一个实例，靠 update() 传路由。
 *    因此「页签身份」必须由路径决定，query 只作为实例内部的路由状态。
 *
 * 2. 页签失活时把容器停放到 body 下的隐藏停车场，实例保持 MOUNTED，不销毁。
 *    这样切回页签时微应用内部状态（含它自己的 keep-alive）原样恢复。
 *
 * 3. 只有当某个微应用已经没有任何页签时，才真正 unmount 并删除容器。
 *
 * 4. update 是异步的，所有更新串行排队，避免快速切页签时路由互相覆盖。
 *
 * 本模块不依赖任何 UI 框架。
 */
/** 微应用运行状态 */
export type MicroAppStatus = 'idle' | 'loading' | 'mounted' | 'error';
/** 路由事件类型 */
export type RouterEventType = 'push' | 'replace' | 'close' | 'refresh' | 'visible';
/** 下发给微应用的路由事件 */
export interface RouterEvent {
    appName: string;
    type: RouterEventType;
    path: string;
    fullPath: string;
    query: RouteQuery;
    params: Record<string, string>;
    /**
     * 当前拥有**独立页签**的 fullPath 集合。
     *
     * 背景：主应用里同一个微应用可能有多个页签（「用户」和「用户详情」），
     * 它们共享同一个 qiankun 实例。切页签时主应用会把微应用切到目标页签的路由，
     * 但 fullPath 本身没法说明「这个 fullPath 有自己的页签」——
     * 子应用内部从父页面跳到子页面时，主应用也会顺势开一个页签，
     * 两种情况长得一样。
     *
     * 所以主应用显式告诉子应用：哪些 fullPath 有独立页签。
     * 子应用据此决定保活策略：
     * - 有独立页签的 fullPath -> 该页签要保住内容（切回该页签时状态还在）；
     * - 没有独立页签的 fullPath -> 只是子应用内部导航过去的
     *   -> 子页面永远刷新（父页面打开子页面，每次都是新实例）。
     *
     * 注意：集合里包含「当前这个」fullPath 时，说明它有自己的页签。
     */
    tabFullPaths?: string[];
}
/** 微应用状态快照 */
export interface MicroAppState {
    status: MicroAppStatus;
    error: string;
    route: RouterEvent | null;
}
/** qiankun 的 loadMicroApp 类型（用 type-only 引入，避免运行时加载） */
export type LoadMicroApp = (options: {
    name: string;
    entry: string;
    container: HTMLElement;
    props?: Record<string, unknown>;
}) => QiankunApp;
/** 运行时选项 */
export interface MicroRuntimeOptions {
    /** 注入 qiankun 的 loadMicroApp，便于测试时 mock */
    loadApp?: LoadMicroApp;
    /** 日志回调 */
    logger?: (event: string, payload?: unknown) => void;
    /** 构造下发给微应用的额外 props */
    buildExtraProps?: (appName: string, route: RouterEvent) => Record<string, unknown>;
}
/** qiankun 微应用实例的最小结构 */
interface QiankunApp {
    mountPromise: Promise<void>;
    loadPromise?: Promise<unknown>;
    update: (props: Record<string, unknown>) => Promise<void>;
    unmount: () => Promise<void>;
    getStatus: () => string;
}
export declare class MicroAppRuntime {
    private apps;
    private containers;
    private states;
    private pendingRoutes;
    /**
     * 正在进行中的加载。
     *
     * load() 里有一处 await（动态 import qiankun），在它 resolve 之前
     * this.apps 里还没有该微应用的实例。此时如果又来一次 showPage，
     * 旧逻辑会认为「还没加载过」而再起一个 load()，
     * 导致同一个容器被 qiankun 加载两次：
     * - 后创建的实例覆盖 this.apps，前一个实例的 mountPromise.then 里的
     *   `if (this.apps.get(appName) !== app) return` 守卫命中，
     *   于是它的 status 永远不会落回 'mounted'；
     * - 结果就是 state.status 永远停在 'loading'，
     *   页面上的「正在加载微应用 xxx …」遮罩一直不消失。
     *
     * 用这个 Map 记录正在进行的加载，showPage 直接复用同一个 Promise。
     */
    private loadingPromises;
    private unmountingPromises;
    private updateQueues;
    private generations;
    /**
     * 每个微应用最近一次「正常挂载」的宿主插槽。
     *
     * 页签「弹窗显示」时，预览视图会把同一个微应用容器临时搬进弹窗
     * （另起容器会再开一个 qiankun 实例，所以只能搬）。
     * 这里记住正常页签的宿主，弹窗关闭、预览视图卸载时把容器挂回去，
     * 否则原页签会一直是空白（容器被停进了隐藏停车场）。
     */
    private lastHosts;
    private parking;
    private options;
    constructor(options?: MicroRuntimeOptions);
    /**
     * 追加 / 覆盖运行时选项。
     *
     * 全局单例 microRuntime 是无参创建的，宿主往往在模块加载之后才知道
     * buildExtraProps（比如要下发 $parentRouter）和 logger，
     * 所以这里提供一个事后配置入口。
     */
    configure(options: Partial<MicroRuntimeOptions>): void;
    private log;
    /** 读取某个微应用的状态 */
    getState(appName: string): MicroAppState;
    /** 隐藏停车场：失活页签的微应用容器停放在这里，实例不销毁 */
    private ensureParking;
    /** 获取（或创建）某个微应用的容器 DOM */
    getContainer(appName: string): HTMLElement;
    /**
     * 把容器挂到当前页签的插槽上。
     * 已经在该插槽里就不重复 append，避免 DOM 抖动导致微应用重排。
     */
    attachContainer(appName: string, host: HTMLElement | null, options?: {
        preview?: boolean;
    }): HTMLElement;
    /**
     * 页签失活：把容器停放到隐藏停车场，实例保持 MOUNTED。
     *
     * 如果这次停放来自预览弹窗的卸载，且原页签宿主还挂在文档里，
     * 就优先挂回原页签，避免关闭弹窗后内容区空白。
     */
    parkContainer(appName: string, host?: HTMLElement | null, options?: {
        preview?: boolean;
    }): void;
    /** 构造下发给微应用的 props */
    private buildProps;
    /** 构造路由事件 */
    buildRouterEvent(appName: string, fullPath: string, type?: RouterEventType, tabFullPaths?: string[]): RouterEvent;
    private fail;
    /** 加载微应用 */
    private load;
    /**
     * 确保微应用已加载（必要时发起加载），返回本次加载的 Promise。
     *
     * 同一个微应用同时只允许一个 load() 在飞：
     * 重复调用会复用同一个 Promise，不会创建第二个 qiankun 实例。
     */
    private ensureLoaded;
    /** 执行一次 update */
    private update;
    /** 按微应用串行更新；generation 变化后旧任务自动失效。 */
    private enqueue;
    /** 串行排队执行路由更新 */
    private navigate;
    /**
     * 显示某个微应用的某个路由。
     * 页签激活时调用。
     *
     * tabFullPaths 是「当前拥有独立页签的 fullPath 集合」，
     * 微应用据此决定哪些 fullPath 要保活（详见 RouterEvent.tabFullPaths）。
     */
    showPage(appName: string, fullPath: string, tabFullPaths?: string[]): Promise<void>;
    /**
     * 刷新微应用当前页面。
     */
    refresh(appName: string, fullPath?: string): Promise<void>;
    /**
     * 通知微应用某个页签已关闭，让它淘汰该页面的保活缓存。
     *
     * 只在该微应用仍被其它页签使用时调用；最后一个页签关闭会走 unmount。
     * 未挂载时直接忽略：没有实例就没有缓存，也不需要排队等挂载后补发。
     */
    closePage(appName: string, fullPath: string, tabFullPaths?: string[]): Promise<void>;
    /**
     * 卸载微应用实例。
     * 只应在该微应用已无任何页签时调用。
     */
    unmount(appName: string): Promise<void>;
    /** 卸载全部微应用 */
    unmountAll(): Promise<void>;
    /** 某微应用是否已加载实例 */
    has(appName: string): boolean;
    /** 清理 DOM 残留（应用销毁时调用） */
    destroy(): void;
}
/** 默认全局运行时 */
export declare const microRuntime: MicroAppRuntime;
/** 归一化路径的再导出，方便适配层直接使用 */
export { normalizePath };

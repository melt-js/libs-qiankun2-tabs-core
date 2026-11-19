import type { MicroPageCache } from './page-cache';
import type { MicroPageRoute } from './page-cache';
import type { RouterEvent } from './runtime';
/**
 * 子应用生命周期的框架中立实现。
 *
 * 缓存同步、路由上报、tabFullPaths 维护、父路由跳转、update 的五个事件分支与卸载清理
 * 都只在这里实现一次；Vue 2 / Vue 3 / React 适配层只负责「怎么建路由、怎么挂载、怎么销毁」。
 */
export interface MicroAppActions {
    setGlobalState: (state: Record<string, unknown>) => unknown;
    onGlobalStateChange?: (...args: unknown[]) => unknown;
}
/** 每个子应用一个动作桥；独立运行时没有宿主可通知。 */
export declare function createMicroAppActions(): {
    setActions(actions?: MicroAppActions): void;
    setGlobalState(state: Record<string, unknown>): unknown;
    onGlobalStateChange(...args: unknown[]): unknown;
};
export type MicroAppActionsBridge = ReturnType<typeof createMicroAppActions>;
export interface MicroChildRoute extends MicroPageRoute {
    fullPath: string;
    query: Record<string, unknown>;
}
/** 结构路由接口：宿主不需要安装任何具体路由库。 */
export interface MicroChildRouter {
    options?: {
        history: {
            readonly location: string;
        };
    };
    currentRoute: {
        readonly value: MicroChildRoute;
    };
    beforeEach: (guard: (to: MicroChildRoute) => void) => () => void;
    afterEach: (guard: (to: MicroChildRoute) => void) => () => void;
    push: (path: string) => Promise<unknown>;
    replace: (path: string) => Promise<unknown>;
    isReady: () => Promise<void>;
}
export interface MicroChildProps {
    container?: Element;
    $parentRouter?: {
        push: (path: string) => unknown;
    };
    routerEvent?: RouterEvent;
    actions?: MicroAppActions;
    setGlobalState?: MicroAppActions['setGlobalState'];
    [key: string]: unknown;
}
/** 适配层需要提供的应用壳；具体框架实例藏在壳后面。 */
export interface MicroChildApp {
    use: (plugin: unknown) => unknown;
    mount: (el: Element | string) => unknown;
    destroy: () => void;
    setParentRouter?: (router: MicroChildProps['$parentRouter']) => void;
}
export type MicroAppCache = MicroPageCache & {
    install: (app: unknown) => void;
};
export interface MicroAppMenuRoute {
    path: string;
    title?: string;
    menu?: boolean;
}
export interface CreateMicroAppControllerOptions {
    appName: string;
    routes: readonly MicroPageRoute[];
    root?: string;
    emptyPath?: string;
    cache: MicroAppCache;
    actions: MicroAppActionsBridge;
    createRouter: () => MicroChildRouter;
    createApp: (props: MicroChildProps, router: MicroChildRouter) => MicroChildApp;
    menu?: readonly MicroAppMenuRoute[];
}
/**
 * 子应用 mount / update / unmount、路由上报与 fullPath 级缓存归属。
 * 返回对象可直接作为 qiankun 生命周期导出。
 */
export declare function createMicroAppController(options: CreateMicroAppControllerOptions): {
    bootstrap: () => Promise<void>;
    mount: (props?: MicroChildProps) => Promise<void>;
    update: (props: MicroChildProps) => Promise<void>;
    unmount: () => Promise<void>;
    cache: MicroAppCache;
    actions: {
        setActions(actions?: MicroAppActions): void;
        setGlobalState(state: Record<string, unknown>): unknown;
        onGlobalStateChange(...args: unknown[]): unknown;
    };
};

/**
 * 微应用注册表。
 *
 * 主应用不登记子应用的具体路由，只按 `/<appName>/*` 前缀匹配。
 * 子应用新增路由时主应用无需改动。
 */
export interface MicroAppConfig {
    /** 微应用唯一名称，同时作为 qiankun 的 app name */
    name: string;
    /** 页签显示标题 */
    title?: string;
    /** 微应用入口地址 */
    entry: string;
    /** 路由前缀，例如 '/app1' */
    activeRule: string;
    /** 打开 '/app1' 这类无子路径地址时的默认落地页 */
    defaultPath?: string;
    /** 容器 DOM id */
    containerId?: string;
    /** 额外的 props，会透传给 qiankun loadMicroApp */
    props?: Record<string, unknown>;
}
/** 注册表 */
export declare class MicroAppRegistry {
    private apps;
    /** 注册（或覆盖）一个微应用 */
    register(config: MicroAppConfig): void;
    /** 批量注册 */
    registerAll(configs: MicroAppConfig[]): void;
    /** 移除 */
    unregister(name: string): void;
    /** 按名称查找 */
    find(name: string): MicroAppConfig | undefined;
    /** 全部已注册微应用 */
    list(): MicroAppConfig[];
    /**
     * 按路径匹配微应用。
     * '/app1'、'/app1/user'、'/app1/user?id=1' 都能匹配到 app1。
     */
    match(path: string | undefined | null): MicroAppConfig | undefined;
    /** 按路径匹配，返回应用名 */
    matchName(path: string | undefined | null): string | undefined;
    /** 判断路径是否属于某个微应用 */
    isMicroPath(path: string | undefined | null): boolean;
    /**
     * 把一个「可能不完整」的微应用路由归一化：
     * - 属于该微应用前缀 -> 原样保留
     * - 缺少子路径（如 '/app1'）-> 落到 defaultPath
     */
    resolvePath(appName: string, path: string | undefined | null): string;
}
/** 默认全局注册表 */
export declare const microAppRegistry: MicroAppRegistry;
/** 便捷函数：注册微应用 */
export declare function registerMicroApp(config: MicroAppConfig): void;
/** 便捷函数：批量注册微应用 */
export declare function registerMicroApps(configs: MicroAppConfig[]): void;
/** 便捷函数：按路径匹配微应用 */
export declare function matchMicroApp(path: string | undefined | null): MicroAppConfig | undefined;
/** 便捷函数：按名称查找微应用 */
export declare function findMicroApp(name: string): MicroAppConfig | undefined;
/** 便捷函数：判断路径是否属于微应用 */
export declare function isMicroPath(path: string | undefined | null): boolean;

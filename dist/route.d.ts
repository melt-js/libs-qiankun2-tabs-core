/**
 * 路由身份模型。
 *
 * 背景：qiankun 微应用在主应用里是「一个应用一个实例」，多个页签共享同一个实例，
 * 只靠 update() 传路由。因此页签身份必须以「路径」为准，而 query 属于同一页签内的
 * 路由状态，不能参与页签去重，否则 /x、/x?id=1、/x?id=2 会被拆成三个页签，
 * 但底层只有一个微应用实例，状态就会互相覆盖。
 *
 * 本模块只提供纯函数，不依赖任何框架。
 */
/** query 值的原始类型：字符串 / 字符串数组 */
export type QueryValue = string | string[];
/** 路由 query 对象 */
export type RouteQuery = Record<string, QueryValue>;
/** 拆分后的路由 */
export interface SplitRoute {
    /** 归一化后的路径（不含 query，无尾斜杠） */
    path: string;
    /** query 参数 */
    query: RouteQuery;
    /** 原始 fullPath（未归一化） */
    fullPath: string;
}
/**
 * 归一化路径：补前导斜杠、去掉尾斜杠、根路径统一为 '/'。
 *
 * '/app2/user/'  -> '/app2/user'
 * 'app2/user'   -> '/app2/user'
 * '/'           -> '/'
 */
export declare function normalizePath(path: string | undefined | null): string;
/**
 * 把 fullPath 拆成「路径身份」和「query 状态」两部分。
 *
 * 这是整个方案的核心：路径决定页签身份，query 只是同一页签内的路由参数。
 */
export declare function splitRoute(fullPath: string | undefined | null): SplitRoute;
/**
 * 解析 query 字符串。重复的参数收敛成数组。
 */
export declare function parseQuery(search: string | undefined | null): RouteQuery;
/**
 * 按 key 排序后把 query 序列化成稳定的查询串。
 *
 * 排序保证 {a:1,b:2} 和 {b:2,a:1} 得到相同结果，
 * 这样同一路径的页签在刷新恢复后仍能对上。
 */
export declare function stringifyQuery(query: RouteQuery | undefined | null): string;
/**
 * 用「路径 + 排序后的 query」重建 fullPath，保证同一路由的表示稳定。
 */
export declare function buildFullPath(path: string, query?: RouteQuery | null): string;
/**
 * 页签身份标识。
 *
 * 同一个微应用的同一个路径 = 同一个页签；query 变化不改变身份。
 */
export declare function tabIdentityOf(appName: string, path: string): string;
/**
 * 从身份标识反解出应用名和路径。
 */
export declare function parseTabIdentity(identity: string): {
    appName: string;
    path: string;
} | null;
/**
 * 判断两个 fullPath 是否指向同一个「页签身份」（忽略 query）。
 */
export declare function isSameTabIdentity(a: string, b: string): boolean;

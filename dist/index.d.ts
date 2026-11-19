/**
 * @melt-js/libs-qiankun2-tabs-core
 *
 * qiankun 2 多标签页的核心层：路由身份模型、query 旁路状态、微应用注册表与保活运行时。
 * 本包不依赖任何 UI 框架，可以被 Vue 2 / Vue 3 / React 等任意宿主使用。
 */
export { normalizePath, splitRoute, parseQuery, stringifyQuery, buildFullPath, tabIdentityOf, parseTabIdentity, isSameTabIdentity, } from './route';
export type { QueryValue, RouteQuery, SplitRoute } from './route';
export { QueryStateStore, queryState } from './query-state';
export type { QueryListener, QueryStateSnapshot } from './query-state';
export { MicroAppRegistry, microAppRegistry, registerMicroApp, registerMicroApps, matchMicroApp, findMicroApp, isMicroPath, } from './registry';
export type { MicroAppConfig } from './registry';
export { MicroAppRuntime, microRuntime } from './runtime';
export type { MicroAppState, MicroAppStatus, MicroRuntimeOptions, RouterEvent, RouterEventType, } from './runtime';
export { PREVIEW_CONTEXT_KEY } from './preview-context';
export { RouteDispatcher, routeDispatcher } from './dispatcher';
export type { RouteDispatchHandler, RouteDispatchPayload, RouteIntent } from './dispatcher';
export { MicroPageCache, createMicroPageCacheState } from './page-cache';
export type { MicroPageRoute, MicroPageCacheState } from './page-cache';
export { createMicroAppActions, createMicroAppController } from './child-controller';
export type { MicroAppActions, MicroAppActionsBridge, MicroAppCache, MicroAppMenuRoute, MicroChildApp, MicroChildProps, MicroChildRoute, MicroChildRouter, CreateMicroAppControllerOptions, } from './child-controller';

/**
 * 预览弹窗（页签「弹窗显示」）的注入标记。
 *
 * `PreviewContainer` 会 provide 这个标记，微应用视图据此告知运行时：
 * 这次挂载是「预览接管」，容器只是临时搬进弹窗，
 * 关闭弹窗、预览视图卸载时要挂回原来的页签插槽。
 */
export declare const PREVIEW_CONTEXT_KEY: unique symbol;

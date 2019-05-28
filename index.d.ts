type Model = Function | { new(): any }
type Rendered = DocumentFragment | HTMLElement
type Selector = string | HTMLElement

type CallableWithModel = (state?: Model) => Rendered
type Prepared = (...args: any[]) => CallableWithModel
type Renderer = (parts: string[], ...exprs: any[]) => Rendered

export type html = Renderer
export type render = Renderer
export function merge(selector: Selector, prepared: Prepared, state?: Model): void
export function prepare(template: Function, state?: Model): Prepared

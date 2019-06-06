type Model = Function | { new(): object }
type AppState = Model | object
type Rendered = DocumentFragment | HTMLElement

type CallableWithModel = (state?: Model) => Rendered
type Prepared = (...args: any[]) => CallableWithModel
type Renderer = (parts: string[], ...exprs: any[]) => Rendered

export type html = Renderer
export type render = Renderer
export function merge(selector: string, prepared: Prepared, state?: AppState): string | void
export function prepare(template: Function, state?: Model): Prepared

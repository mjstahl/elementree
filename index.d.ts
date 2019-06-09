type Model = Function | { new(): object }
type AppState = Model | object

type CallableWithModel = (state?: Model) => HTMLElement
type Prepared = (...args: any[]) => CallableWithModel
type Renderer = (strings: TemplateStringsArray, ...keys: any[]) => HTMLElement

export type html = Renderer
export type render = Renderer
export function merge(selector: string, prepared: Prepared, state?: AppState): string | void
export function prepare(template: Function, state?: Model): Prepared

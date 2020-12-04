import { globalTracer, Span } from 'opentracing'
export interface Field { 
  span: Span
}
class Context {
  
  _span: Span
  constructor (fields: Field) {
    this._span = fields.span
  }

  set span (value) {
    this._span = value
  }

  get span () {
    return this._span
  }
}

export default Context

export const contextWithNewSpan = function(name?: string): Context {
  const c = new Context({
    span: globalTracer().startSpan(name || 'request')
  })
  return c
}
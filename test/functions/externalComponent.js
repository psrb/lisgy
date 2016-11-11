/* global describe, it */
import { expect } from 'chai'
import externalComponentImpl from '../../src/functions/externalComponent'
import { createPort } from '../../src/util/graph'
import { wrapFunction, Graph, defaultContext } from './utils'
import { parse } from '../../src/parser'
import { compile } from '../../src/compiler'

const externalComponent = wrapFunction(externalComponentImpl)

describe('external components', () => {
  it('finds and inserts components from the context', () => {
    const testContext = Object.assign(defaultContext(), {
      components: {
        '+': {
          componentId: '+',
          ports: [
            createPort('s1', 'input', 'generic'),
            createPort('s2', 'input', 'generic'),
            createPort('sum', 'output', 'generic')
          ],
          nodes: [],
          edges: [],
          Note: 'defcop'
        }
      }
    })
    const { graph } = externalComponent('(+ 3 3)', testContext)
    expect(Graph.toJSON(graph)).to.not.deep.equal(Graph.toJSON(Graph.empty()))
  })

  it.skip('adds extra info to a node', () => {
    const parsed = parse(`(defcop math/add [s1 s2] [o1]) (math/add 1 2 {:extraA "info"
                                                                        :extraB {A [1 2 3]}})`)
    const compiled = compile(parsed)
    const node = Graph.toJSON(compiled).nodes[0]
    expect(node).to.be.defined
    expect(node).to.containSubset({extraA: 'info', extraB: {A: [1, 2, 3]}})
  })
})

import * as Graph from '@buggyorg/graphtools'
import _ from 'lodash'
import { createPort } from '../util/graph'
import { compilationError } from '../../src/compiler'

/**
 * (lambda [p1 p2 ...] (fn ...))
 */
export default function (ednObject, { context, compile, graph }) {
  const parameters = ednObject.val[1].val
  // console.log(JSON.stringify(parameters, null, 2))

  const implementation = ednObject.val[2]
  // console.log(JSON.stringify(implementation, null, 2))

  let lambdaNode = Graph.compound({
    id: _.uniqueId('lambdaNode_'),
    componentId: 'functional/lambda',
    ports: [
      { name: 'fn', kind: 'output', type: 'function' }
    ]
  })

  const compiledImplementation = compile(implementation, context, Graph.compound({
    id: _.uniqueId('lambdaImplNode_'),
    ports: [
      ...parameters.map((p) => createPort(`in_${p}`, 'input', 'generic')),
      createPort('output', 'output', 'generic')
    ]
  }))

  if (!compiledImplementation.result) {
    throw compilationError('Component has no value', implementation.val[2])
  }

  lambdaNode = lambdaNode.addNode(compiledImplementation.graph)
  // TODO add the edge

  const newGraph = graph.addNode(lambdaNode)

  // console.log(JSON.stringify(newGraph, null, 2))

  return {
    context: Object.assign({}, context, {}),
    graph: newGraph,
    result: {
      node: [lambdaNode.id],
      port: 'fn'
    }
  }
}

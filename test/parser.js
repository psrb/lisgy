/* global describe, it */
import { expect } from 'chai'
import { parse } from '../src/parser'

describe('the parser', () => {
  it('should parse code and return an edn object', () => {
    const edn = parse(`
      (import all)
      (foo "bar")
    `)
    expect(edn.val).to.have.length(2)
  })

  it('should subtract the offset from the columns of the first line', () => {
    const edn = parse('(foo bar)')
    expect(edn.val[0].val[0].posColStart).to.equal(1)
  })

  it('should throw on syntax errors', () => {
    let parsed = false
    try {
      parse('(foo))')
      parsed = true
    } catch (err) {
      expect(err.message).to.be.defined
      expect(err.location).to.be.defined
      expect(err.moduleName).to.be.defined

      expect(err.location.startLine).to.equal(1)
      expect(err.location.startCol).to.equal(5)
    }

    if (parsed) {
      expect.fail()
    }
  })
})
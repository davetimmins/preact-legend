import expect from 'expect'
import {h, render} from 'preact'

import App from 'src/components/app-main'

describe('App component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    render(null, node)
  })

  it('renders without error', () => {
    render(<App/>, node)
    expect(node.textContent).toBe('')
  })
})

import React from 'react'
import ReactDOM from 'react-dom'
import KnownProblems from './known-problems/KnownProblems'
import retargetEvents from 'react-shadow-dom-retarget-events'
import Styles from 'collect-css-loader/runtime/Styles'
import './styles.less'
import {Context} from './context'
import ErrorBoundary from './ErrorBoundary'

class KnownProblemsComponent extends HTMLElement {
    shadowRoot
    renderTo
    isMounted
    removeStyles
    removeListeners

    constructor(props) {
        super()
        this.shadowRoot = this.attachShadow({mode: 'open'})
        this.renderTo = null
        this.isMounted = false
        this.props = props
    }

    propsChangedCallback(props) {
        this.props = props
        this.render()
    }

    connectedCallback() {
        this.mount()
        this.render()
    }

    disconnectedCallback() {
        this.unmount()
    }

    mount() {
        if (!this.isMounted) {
            this.removeStyles = Styles.get('known-problems').applyTo(this.shadowRoot)
            this.renderTo = document.createElement('div')
            this.shadowRoot.appendChild(this.renderTo)
            this.removeListeners = retargetEvents(this.shadowRoot)
            this.isMounted = true
        }
    }

    unmount() {
        ReactDOM.unmountComponentAtNode(this.renderTo)
        this.shadowRoot.removeChild(this.renderTo)
        this.renderTo = null
        this.removeStyles()
        this.removeListeners()
        this.isMounted = false
    }

    render() {
        ReactDOM.render(
            <ErrorBoundary {...this.props}>
                <Context.Provider value={this.props.api}>
                    <KnownProblems {...this.props}/>
                </Context.Provider>
            </ErrorBoundary>, this.renderTo
        )
    }
}

export default KnownProblemsComponent

import { h, VNode, Component } from 'preact'
import classNames from '../utils/classnames'
import { getClasses } from '../utils/Base'

export interface StateType extends ComponentBaseState {
}
export interface PropsType extends StateType {
    align?: 'right'
    content?: Content
    toggle?: boolean
    trigger?: 'click' | 'hover' | 'focus'
    up?: boolean 
}

let Dropdown_Index = 0
class Dropdown extends Component<PropsType, StateType> {
    state: StateType
    index: number
    constructor(props: PropsType) {
        super(props)
        this.state = {
            isActive: props.isActive || false
        }
        this.index = ++Dropdown_Index
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.isActive !== this.state.isActive) {
            this.setState({
                isActive: nextProps.isActive
            })
        }
    }
    
    onClick = () => {
        const { trigger = 'click', toggle = true } = this.props
        const { isActive } = this.state
        if (trigger === 'click') {
            this.setState({
                isActive: toggle ? !isActive : true
            })
        }
    }
    onFocus = () => {
        const { trigger } = this.props
        if (trigger === 'focus') {
            this.setState({
                isActive: true
            })
        }
    }
    onBlur = () => {
        const t = this
        setTimeout(function () {
            t.setState({
                isActive: false
            })
        }, 200)
    }
    render(node: VNode) {
        const { state, props, onClick } = this
        const { isActive } = state
        const { content = '', align = 'left', trigger = 'click', up = false } = props
        const btnProps = Object.assign({}, props, {isActive: false})
        return <div className={classNames({
            'dropdown': true,
            'is-active': isActive,
            'is-right': align === 'right',
            'is-hoverable': trigger === 'hover',
            'is-up': up
        })}>
            <div className="dropdown-trigger" onClick={this.onClick}>
                <button className={getClasses(btnProps, 'button')}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    aria-haspopup="true"
                    aria-controls={`dropdown-menu${this.index}`}
                >
                    {node.children}
                </button>
            </div>
            <div className="dropdown-menu" id={`dropdown-menu${this.index}`} role="menu">
                {content}
            </div>
        </div>
    }
}

export class Content extends Component<{ className?: string }, any> {
    render (node: VNode) {
        const { className } = this.props
        return <div className={classNames([className, 'dropdown-content'])}>{node.children}</div>
    }
}
export class Item extends Component<{ className?: string, isActive?: boolean }, any> {
    render(node: VNode) {
        const { className, isActive } = this.props
        return <a className={classNames([className, 'dropdown-item', isActive && 'is-active'])}>{node.children}</a>
    }
}

Object.assign(Dropdown, {
    Content,
    Item
})

export default Dropdown
import { h, VNode, Component } from 'preact'

export interface MenuItem {
    href?: string
    title?: string
    key: string
    item: string | VNode
}
export interface MenuGroup {
    label?: string | VNode
    list: MenuItem[]
}
export interface MenuPropsType {
    onSelect?: {
        (key: string): void
    }
    className?: string
    activeKey?: string
    menus?: MenuGroup[]
}
export interface MenuStateType {
    activeKey?: string
}

export default class extends Component<MenuPropsType, MenuStateType> {
    props: MenuPropsType
    state: MenuStateType
    constructor (props: MenuPropsType) {
        super(props)
        this.state = {
            activeKey: props.activeKey
        }
    }
    onClick = (key: string) => {
        const { onSelect } = this.props
        onSelect && onSelect(key)
        this.setState({
            activeKey: key
        })
    }
    render(node: VNode) {
        const {
            className = '',
            menus = []
        } = this.props
        const {
            activeKey
        } = this.state
        const {
            onClick
        } = this
        return <aside className={`menu ${className}`}>
            {menus.reduce((arr, { label, list }) => {
                label && arr.push(label)
                list && list.length && arr.push(list)
                return arr
            }, []).map((item, index) => {
                if (Array.isArray(item)) {
                    return <ul className="menu-list" key={`${index}`}>
                        {item.map(({key, item, className = '', href, title}) => <li key={key}>
                            <a href={href} title={title}
                                className={className + (key === activeKey ? ' is-active' : '')}
                                onClick={() => onClick(key)}
                            >{item}</a>
                        </li>)}
                    </ul>
                } else {
                    return <p class="menu-label">{item}</p>
                }
            })}
        </aside>
    }
}
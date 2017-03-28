import React, {Component} from 'react';
import {Link} from 'react-router';
import {createStore} from 'redux';
import './style.scss';

function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
let store = createStore(counter);
// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() => console.log(store.getState()));

//es6语法
class Catalog extends Component {
    componentDidMount() {
        store.dispatch({type: 'INCREMENT'});
        store.dispatch({type: 'DECREMENT'});
    };
    render() {
        return (
            <ul className="nav">
                <li>
                    <Link to="/hello/King">About</Link>
                </li>
            </ul>
        );
    }
}
module.exports = Catalog;
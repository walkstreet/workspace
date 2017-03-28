import React,{Component} from 'react';
import './style.scss';
//es6语法
class HelloWorld extends Component{
    componentDidMount(){
        console.info("new");
    };
    render(){
        return(
            <div className="text">
                <h1>Hello,{this.props.params.name}!</h1>
                <h2>new World!</h2>
            </div>
        );
    }
}
module.exports = HelloWorld;
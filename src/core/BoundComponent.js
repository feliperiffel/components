import {Component} from 'react';

class BoundComponent extends Component {
    constructor(props) {
        super(props);

        let ignoreMethods = ["constructor", "render", "componentWillReceiveProps", "componentWillMount", "componentDidMount", "componentWillUpdate", "componentDidUpdate"];
        let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        let self = this;

        methods.forEach(function(methodName) {
            if(typeof self[methodName] === "function" && ignoreMethods.indexOf(methodName.toLowerCase()) === -1 ) {
                self[methodName] = self[methodName].bind(self);
            }
        });
    }
}

export default BoundComponent;
import React from 'react';
import AbstractInput from "./AbstractInput";
import PropTypes from 'prop-types';

class InputNumber extends AbstractInput {

    constructor(props) {
        super(props);
    }

    render() {
        let inputProps = {
            className:"input",
            type: "number",
            value: this.state.value,
            onChange: this.handleOnChange,
        };
        if (this.props.className) {
            inputProps.className += " " + this.props.className;
        }
        if (this.props.placeholder) {
            inputProps.placeholder = this.props.placeholder;
        }

        return (
            <input  {...inputProps} />
        )
    }
}

InputNumber.propTypes = {
    entry: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
    property: PropTypes.string,
    onChange: PropTypes.func
};

export default InputNumber;
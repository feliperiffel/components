import React from 'react';
import AbstractInput from "./AbstractInput";
import PropTypes from 'prop-types';

class InputNumber extends AbstractInput {

    render() {
        let inputProps = Object.assign(this.getBaseProps(), {type: "number"});
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
import React from 'react';
import AbstractInput from "./AbstractInput";
import PropTypes from 'prop-types';

class InputText extends AbstractInput {

    constructor(props) {
        super(props);
    }

    render() {
        let inputProps = Object.assign(this.getBaseProps(), {type: "text"});
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

InputText.propTypes = {
    entry: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
    property: PropTypes.string,
    onChange: PropTypes.func
};

export default InputText;
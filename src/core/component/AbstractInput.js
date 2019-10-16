import BoundComponent from "../BoundComponent";
import ObjectUtils from "../util/ObjectUtils";
import PropTypes from "prop-types";

class AbstractInput extends BoundComponent {

    constructor(props){
        super(props);

        this.state = {
            value: props.property ? ObjectUtils.getValue(props.entry, props.property) : props.entry
        };

        this.handleOnChange = this.handleOnChange.bind(this);
        this.effectiveChangeValue = this.effectiveChangeValue.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.getBaseProps = this.getBaseProps.bind(this);
        this.getInputValue = this.getInputValue.bind(this);
    }

    handleOnChange(e) {
        let newValue = e.target.value;
        if (!this.props.applyOnBlur) {
            this.effectiveChangeValue(newValue);
        } else {
            this.setState({tmpValue: newValue});
        }
    }

    handleOnBlur(e) {
        console.log(e);
        if (this.props.applyOnBlur) {
            this.effectiveChangeValue(this.state.tmpValue);
        }
    }

    effectiveChangeValue(value) {
        let newValueEvent = {target: {id: this.props.id, source: this.props.source, value: value}};

        if (this.props.validateChange && !this.props.validateChange(newValueEvent)) {
            this.setState({tmpValue: this.state.value});
            return;
        }

        if (this.props.property) {
            ObjectUtils.setValue(this.props.entry, this.props.property, value);
        }
        this.setState({value: value, tmpValue: value});
        if (this.props.onChange) {
            this.props.onChange(newValueEvent);
        }
    }

    getBaseProps() {
        return ({
            className:"input",
            value: this.getInputValue(),
            onChange: this.handleOnChange,
            onBlur: this.handleOnBlur
        });
    }

    getInputValue() {
        return this.state.tmpValue ? this.state.tmpValue : this.state.value;
    }

}

AbstractInput.propTypes = {
    property: PropTypes.string,
    onChange: PropTypes.func,
    validateChange: PropTypes.func,
    applyOnBlur: PropTypes.bool
};

export default AbstractInput;
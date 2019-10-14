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
    }

    handleOnChange(e) {
        if (this.props.property) {
            ObjectUtils.setValue(this.props.entry, this.props.property, e.target.value);
        }
        this.setState({value: e.target.value});
        if (this.props.onChange) {
            this.props.onChange({target: Object.assign(e.target, {id: this.props.id, source: this.props.source, value: e.target.value})});
        }
    }
}

AbstractInput.propTypes = {
    property: PropTypes.string,
    onChange: PropTypes.func
};

export default AbstractInput;
import React, {Component} from 'react'
import PropTypes from "prop-types";

class ScrollViewEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            top: props.top,
            entry: props.entry};
        this.setTop = this.setTop.bind(this);
    }

    setTop(newTop){
        this.setState({top: newTop})
    }

    onlyUpdateEntry(){
        for (let ref in this.refs){
            this.refs[ref].setState({});
        }
    }

    render(){
        var EntryView = this.props.entryView;

        return (
            <div key={this.props.key + "_1"} className={this.props.entryClass}
                style={{height: this.props.entryHeight + 'px',
                        width: '100%',
                        position: 'relative',
                        top: this.state.top}}>
                {
                    this.state.entry ?
                        <EntryView ref="entryView" index={this.props.index} entry={this.state.entry} properties={this.props.entryProperties}/>
                        : ""
                }
            </div>
        );
    }
}
ScrollViewEntry.propTypes = {
    entryClass: PropTypes.string,
    top: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    entry: PropTypes.any,
    entryView: PropTypes.any,
    entryProperties: PropTypes.any,
    entryHeight: PropTypes.number,
};

export default ScrollViewEntry;
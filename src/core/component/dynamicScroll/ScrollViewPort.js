import React from 'react'
import BoundComponent from "../../BoundComponent";
import PropTypes from "prop-types";
import ScrollViewContainer from './ScrollViewContainer'

class ScrollViewPort extends BoundComponent {

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.updateViewPortSize = this.updateViewPortSize.bind(this);
    }

    handleScroll(e){
        this.updateViewPortSize();
    }

    componentDidMount(){
        this.updateViewPortSize();
    }

    componentDidUpdate(){
        this.updateViewPortSize();
    }

    updateViewPortSize(){
        if(this.refs.viewPort && this.refs.scrollContainer){
            var rect =this.refs.viewPort.getBoundingClientRect();
            this.refs.scrollContainer.updateViewPortSize(rect);
        }
    }

    getViewPortRef(){
        if (this.refs.viewPort)
            return this.refs.viewPort;
    }

    handleOnNeedResetScroll(){

        if (this.refs.viewPort)
            this.refs.viewPort.scrollTop = 0;

        if (this.props.onNeedResetScroll)
            this.props.onNeedResetScroll();
    }

    onlyUpdateEntries(){
        if (this.refs.scrollContainer)
            this.refs.scrollContainer.onlyUpdateEntries();
    }

    render(){
        let style = {
            overflow: 'auto'
        };
        if (this.props.height){
            style.height = this.props.height
        }

        return <div ref="viewPort"
                    className={this.props.viewPortClass}
                    id={this.props.id}
                    onScroll={this.handleScroll}
                    style={style}>
            <ScrollViewContainer ref="scrollContainer"
                                 scrollContainerClass={this.props.scrollContainerClass}
                                 entryClass={this.props.entryClass}
                                 list={this.props.list}
                                 entryView={this.props.entryView}
                                 entryHeight={this.props.entryHeight}
                                 entryProperties={this.props.entryProperties}
                                 entryRefKey={this.props.entryRefKey}
                                 upperContainerMargin={this.props.upperContainerMargin}
                                 onNeedResetScroll={this.handleOnNeedResetScroll}
            />
        </div>
    }
}
ScrollViewPort.propTypes = {
    height: PropTypes.number,
    viewPortClass: PropTypes.string,
    scrollContainerClass: PropTypes.string,
    entryClass: PropTypes.string,
    list: PropTypes.array,
    entryView: PropTypes.any,
    entryProperties: PropTypes.any,
    entryHeight: PropTypes.number,
    entryRefKey: PropTypes.string,
    upperContainerMargin: PropTypes.number,
    onNeedResetScroll: PropTypes.func
};

export default ScrollViewPort;
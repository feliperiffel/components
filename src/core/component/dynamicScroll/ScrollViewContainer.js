import React, {Component} from 'react'
import PropTypes from "prop-types";
import ScrollViewEntry from "./ScrollViewEntry";

class ScrollViewContainer extends Component {
    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.updateViewPortSize = this.updateViewPortSize.bind(this);

        this.state = { top: undefined, viewPortRect: undefined };
        this.lastRender = {pos: -1, top: -2};
        this.lastTop = 0;
    }

    handleScroll(viewPortRect){
        if (this.refs.scrollContainer){
            this.updateViewPortSize(viewPortRect);
        }
    }

    updateViewPortSize(viewPortRect){
        if (this.refs.scrollContainer){
            var rect = this.refs.scrollContainer.getBoundingClientRect();
            this.setState({ top:rect.top, viewPortRect: viewPortRect });
        }
    }

    onlyUpdateEntries(){
        for (let ref in this.refs){
            if (ref.indexOf("entryView_") === 0){
                this.refs[ref].onlyUpdateEntry({});
            }
        }
    }

    render() {

        var list = this.props.list;
        if (!list){
            list = [];
        }
        var entryHeight = this.props.entryHeight;
        if (!entryHeight){
            entryHeight = 20;
        }

        var containerHeight = list.length * entryHeight;
        if (this.props.upperContainerMargin){
            containerHeight += this.props.upperContainerMargin;
        }

        var viewPortHeight = 0;
        var viewPortTop = 0;
        if (this.state.viewPortRect){
            viewPortHeight = this.state.viewPortRect.height;
            viewPortTop = this.state.viewPortRect.top;
        }

        var entries = [];
        var visibleEntriesQuantity = 0;
        if (viewPortHeight > 0 && entryHeight > 0){
            visibleEntriesQuantity = Math.ceil(viewPortHeight/entryHeight);
        }

        var containerScrolled = 0;
        if (this.state.top){
            containerScrolled = viewPortTop - Number(this.state.top);
        }

        var initialRenderListPosition = 0;
        if (containerScrolled > entryHeight){
            initialRenderListPosition = Math.trunc(containerScrolled / entryHeight);
        }

        var scrollingState = 'Up';
        if (this.state.top > this.lastTop){
            scrollingState = 'Down';
        }
        this.lastTop = this.state.top;

        if (this.lastRender.pos !== initialRenderListPosition){
            this.lastRender.pos = initialRenderListPosition;
            this.lastRender.top = containerScrolled;
            if (scrollingState === "Down"){
                this.lastRender.top = containerScrolled - entryHeight;
            }
            if (this.lastRender.top < 0){
                this.lastRender.top = 0;
            }
            if (this.props.upperContainerMargin && initialRenderListPosition === 0){
                this.lastRender.top = this.props.upperContainerMargin;
            }
        }

        if (initialRenderListPosition > list.length && this.props.onNeedResetScroll){
            this.props.onNeedResetScroll();
        }

        for (var i = this.lastRender.pos; i < (initialRenderListPosition + visibleEntriesQuantity); i++){

            var refId = "entryView_"+i;
            if (this.refs[refId]){
                this.refs[refId].setTop(this.lastRender.top);
            }
            var keyId = refId;
            if (this.props.entryRefKey && list[i]){
                keyId = "entryView_" + list[i][this.props.entryRefKey]
            }

            entries.push(<ScrollViewEntry ref={refId}
                                          key={keyId}
                                          top={this.lastRender.top}
                                          index={i}
                                          entry={list[i]}
                                          entryView={this.props.entryView}
                                          entryProperties={this.props.entryProperties}
                                          entryHeight={entryHeight}/>);
        }

        return (
            <div ref="scrollContainer"
                 className={this.props.scrollContainerClass}
                 style={{height: containerHeight + 'px'}}>
                {entries}
            </div>
        );
    }
}
ScrollViewContainer.propTypes = {
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

export default ScrollViewContainer;
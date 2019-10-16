import React from 'react';
import BoundComponent from "../../core/BoundComponent";
import ScrollViewPort from '../../core/component/dynamicScroll/ScrollViewPort';
import PageSizeController from "../../PageSizeController";
import InputNumber from "../../core/component/InputNumber";

const LIST_HEIGHT_DIFF = 237;

class DynamicScrollPage extends BoundComponent {

    constructor(props) {
        super(props);

        let fixedList = [];
        this.changeListSize(fixedList, 100000);
        let dynamicList = [];
        this.changeListSize(dynamicList, 3);

        this.dynamicListRef = undefined;

        this.testSubject = {
            dynamicList: dynamicList,
            fixesList: fixedList,
        };

        this.state = {
            dynamicListSize:3,
            listHeight: PageSizeController.getCurrentPageSize().height - LIST_HEIGHT_DIFF,
        }
    }

    changeListSize(list, newSize) {
        if (list.length > newSize) {
            for (var i = list.length; i > newSize; i--) {
                list.pop();
            }
        } else if (list.length < newSize) {
            for (var i = list.length; i < newSize; i++) {
                list.push({name: "element_" + i});
            }
        }
    }

    handleChangeDynamicListSize(e) {
        let newLength = e.target.value || 0;
        this.changeListSize(this.testSubject.dynamicList, newLength);
        this.setState({});
    }

    handlePageResize(e) {
        this.setState({listHeight: e.size.height - LIST_HEIGHT_DIFF});
    }

    componentDidMount() {
        PageSizeController.subscribe("DynamicScrollPage", this.handlePageResize);
    }

    componentWillUnmount() {
        PageSizeController.unsubscribe("DynamicScrollPage");
    }

    render() {
        return (
            <div id="DataSetPage" className="columns">
                <div className="column is-half">
                    <div className="columns">
                        <div className="column">
                            <h1 className="title">Array Sample</h1>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-narrow" style={{paddingTop: "16px"}}>
                            <label>Dynamic list size: </label>
                        </div>
                        <div className="column">
                            <InputNumber id={"DynamicListSize"}
                                         entry={this.state.dynamicListSize}
                                         applyOnBlur={true}
                                         onChange={this.handleChangeDynamicListSize}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <ScrollViewPort key={this.testSubject.dynamicList.length}
                                            ref={(ref) => {this.dynamicListRef = ref}}
                                            viewPortClass={"scroll_bar"}
                                            height={this.state.listHeight - 60}
                                            entryHeight={30}
                                            entryView={ListEntry}
                                            entryProperties={{list: this.testSubject.dynamicList}}
                                            list={this.testSubject.dynamicList}/>
                        </div>
                    </div>
                </div>
                <div className="column is-half">
                    <div className="columns">
                        <div className="column">
                            <h1 className="title">Static List (100000 Items)</h1>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <ScrollViewPort viewPortClass={"scroll_bar"}
                                            height={this.state.listHeight}
                                            entryHeight={30}
                                            entryView={ListEntry}
                                            entryProperties={{list: this.testSubject.fixesList}}
                                            list={this.testSubject.fixesList}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class ListEntry extends BoundComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{display: "flex", border: "1px black solid", height: "100%"}}>
                <div style={{flexGrow: "1"}}>
                    Index: {this.props.index}
                </div>
                <div style={{flexGrow: "1"}}>
                    Entry Name: {this.props.entry.name}
                </div>
            </div>
        )
    }
}

export default DynamicScrollPage;
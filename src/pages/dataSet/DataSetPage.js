import React from 'react';
import BoundComponent from "../../core/BoundComponent";
import DataSet, {SETS} from "../../core/component/DataSet";
import ReactJson from 'react-json-view';
import './DataSetPage.css';

class DataSetPage extends BoundComponent {

    constructor(props) {
        super(props);

        this.testSubject = {
            arrayContent: [],
            mapContent: {},
        };
        this.state = {
            arrayVersion:0,
            mapVersion: 0
        }
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
                        <div className="column json-sample scroll_bar">
                            <ReactJson
                                key={this.state.arrayVersion}
                                name={"array"}
                                collapsed={false}
                                enableClipboard={false}
                                src={this.testSubject.arrayContent}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <DataSet id="arrayDataSet"
                                     dataSource={this.testSubject.arrayContent}
                                     set={SETS.ArrayTestSet}
                                     onChangeCallback={() => {this.setState({arrayVersion: this.state.arrayVersion + 1})}}/>
                        </div>
                    </div>
                </div>
                <div className="column is-half">
                    <div className="columns">
                        <div className="column">
                            <h1 className="title">Map Sample</h1>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column json-sample scroll_bar">
                            <ReactJson
                                key={this.state.mapVersion}
                                name={"map"}
                                collapsed={false}
                                enableClipboard={false}
                                src={this.testSubject.mapContent}/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <DataSet id="mapDataSet"
                                     dataSource={this.testSubject.mapContent}
                                     set={SETS.MapTestSet}
                                     onChangeCallback={() => {this.setState({mapVersion: this.state.mapVersion + 1})}}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DataSetPage;
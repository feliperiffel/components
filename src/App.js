import React from 'react';
import './App.css';
import BoundComponent from "./core/BoundComponent";
import InputText from "./core/component/InputText";
import InputNumber from "./core/component/InputNumber";
import DataSet, {SETS} from "./core/component/DataSet";

class App extends BoundComponent {

    constructor(props) {
        super(props);
        this.text = "a";
        this.number = 1;
        this.array = [];
    }

    onTextChanged() {
        console.log(this.text);
    }

    onNumberChanged() {
        console.log(this.number);
    }

    render() {
        return (
            <div className="container  is-fluid">
                {/*<InputText entry={this} property={"text"} onChange={this.onTextChanged}/>*/}
                {/*<InputNumber entry={this} property={"number"} onChange={this.onNumberChanged}/>*/}
                <DataSet id={"data_set"} label={"teste"} dataSource={this.array} set={SETS.ArrayTestSet} />
            </div>
        )
    }
}

export default App;

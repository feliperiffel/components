import React from 'react';
import PropTypes from 'prop-types';
import BoundComponent from "./../BoundComponent";
import ObjectUtils from './../util/ObjectUtils';
import _ from 'lodash';

import InputText from "./InputText";
import InputNumber from "./InputNumber";

const FIELD_TYPES = {
    LABEL: "Label",
    NUMBER: "Number",
    TEXT: "Text"
};

const FIELD = {
    CONTENT: "CONTENT",
    CONTENT_ARRAY: "CONTENT_ARRAY",
    CONTENT_TEXT: "CONTENT_TEXT",
    MAP_KEY: "MAP_KEY"
};

export const SET_TYPES = {
    SEQUENTIAL_MAP: "Sequential Map",
    ARRAY: "Array",
    MAP: "Map",
    DATA_SET: "DataSet"
};

export const SETS = {
    ArrayTestSet: {
        type: SET_TYPES.ARRAY,
        removeData: true,
        insertData: true,
        copyLastOnInsertion: true,
        columns: [
            {label: "FieldA", field: "fieldA", type: FIELD_TYPES.TEXT},
            {label: "FieldB", field: "fieldB", type: FIELD_TYPES.NUMBER},
            {label: "FieldC", field: "fieldC", type: FIELD_TYPES.TEXT}]
    },
    MapTestSet: {
        type: SET_TYPES.MAP,
        defaultKey: "keyOne",
        removeData: true,
        insertData: true,
        copyLastOnInsertion: true,
        baseElement: {fieldA: undefined, fieldB: undefined},
        columns: [
            {label: "Key", field: FIELD.MAP_KEY, type: FIELD_TYPES.TEXT},
            {label: "FieldA", field: "fieldA", type: FIELD_TYPES.TEXT},
            {label: "FieldB", field: "fieldB", type: FIELD_TYPES.TEXT},
        ]
    },
    DeliveryOrderInner: {
        type: SET_TYPES.ARRAY,
        removeData: true,
        insertData: true,
        columns: [
            {label: "Deliverable", field: "deliverable", type: FIELD_TYPES.TEXT, singleSelection: true},
            {label: "Weight", field: "weight", type: FIELD_TYPES.NUMBER}]
    }
};

class DataSet extends BoundComponent {

    constructor(props) {
        super(props);

        let self = this;
        this.columnsArea = 100;
        if (props.set.removeData) {
            this.columnsArea -= 5;
        }
        props.set.columns.forEach(function (columnProps) {
            if (columnProps.width) {
                self.columnsArea -= columnProps.width;
            }
        });
        this.columnArea = this.columnsArea / props.set.columns.length;
        this.keyMap = {};
    }

    handleChangeElementField(e) {
        this.effectiveFieldChange(e.target.source.elementId, e.target.source.field, e.target.value);
        this.refreshRefsWithProperties();
    }

    handleChangeElementFieldSelect(e) {
        let field = e.target.source.field;
        let entryId = e.target.source.elementId;

        let columnProps = this.props.set.columns.find(function (c) {
            return c.field === field
        });
        if (columnProps) {

            let externalName = columnProps.externalName || columnProps.field;
            if (columnProps.propertyValue) {
                if (columnProps.singleSelection) {
                    this.effectiveFieldChange(entryId, field, this.props.store.getExternalItem(externalName, e.target.value));
                } else {
                    let value = [];
                    let self = this;
                    e.target.value.forEach(function (el) {
                        value.push(self.props.store.getExternalItem(externalName, el.value))
                    });

                    this.effectiveFieldChange(entryId, field, value);
                }
            } else {
                if (columnProps.singleSelection) {
                    this.effectiveFieldChange(entryId, field, e.target.value);
                } else {
                    this.effectiveFieldChange(entryId, field, e.target.value.map(function (el) {
                        return el.value;
                    }));
                }
            }
        }
    }

    effectiveFieldChange(entryIndex, field, value) {
        if (field === "MAP_KEY") {
            if (this.props.set.type === SET_TYPES.MAP || this.props.set.type === SET_TYPES.SEQUENTIAL_MAP) {

                let exists = value in this.props.dataSource;
                if (!exists) {
                    let keyContent = this.props.dataSource[entryIndex];
                    let elementKey = this.keyMap[entryIndex];

                    delete this.props.dataSource[entryIndex];
                    delete this.keyMap[entryIndex];

                    this.props.dataSource[value] = keyContent;
                    this.keyMap[value] = elementKey;

                } else {
                    console.error("Key already exists");
                }
            }
        } else {
            if (field.indexOf("CONTENT") >= 0) {
                this.props.dataSource[entryIndex] = value;
            } else {
                //ObjectUtils.setValue(this.props.dataSource[entryIndex], field, value);
            }
        }
        if (this.props.onChangeCallback !== undefined) {
            this.props.onChangeCallback(entryIndex, this.props.dataSource);
        }
        this.setState({});
    }

    validateFieldChange(e) {
        let field = e.target.source.field;
        let newValue = e.target.value;

        if (field === "MAP_KEY") {
            if (this.props.set.type === SET_TYPES.MAP || this.props.set.type === SET_TYPES.SEQUENTIAL_MAP) {
                if (newValue in this.props.dataSource) {
                    return false;
                }
            }
        }
        return true;
    }

    handleRemoveElement(e) {
        let elementId = e.target.dataset.removeid;

        if (this.props.set.removeConfirmation) {
            //TODO: Implement popup message
            console.warn("//TODO: Implement popup message");
            this.effectiveRemoveElement(elementId);
            // let self = this;
            // let confirmationString = this.props.set.removeConfirmation.replace(/%id/g, elementId);
            // FlashDialogHelper.addConfirm(confirmationString, function (confirm) {
            //     if (confirm) {
            //         self.effectiveRemoveElement(elementId);
            //     }
            // })
        } else {
            this.effectiveRemoveElement(elementId);
        }
    }

    effectiveRemoveElement(elementId) {
        switch (this.props.set.type) {
            case SET_TYPES.SEQUENTIAL_MAP:

                var tempId = Number(elementId);
                while (this.props.dataSource[tempId + 1]) {
                    this.props.dataSource[tempId] = this.props.dataSource[tempId + 1];
                    tempId++;
                }
                delete this.props.dataSource[tempId];
                break;
            case SET_TYPES.ARRAY:
                this.props.dataSource.splice(elementId, 1);

                break;
            default:
                delete this.props.dataSource[elementId];
        }
        if (this.props.onChangeCallback !== undefined) {
            this.props.onChangeCallback(elementId, undefined, "DELETE");
        }
        this.setState({});
    }

    generateNewObject() {
        if (this.props.set.baseElement) {
            return _.cloneDeep(this.props.set.baseElement);
        }

        var newObject = {};
        this.props.set.columns.forEach(function (columnProps) {
            if (columnProps.field === FIELD.CONTENT_ARRAY) {
                newObject = [];
            } else if (columnProps.field === FIELD.CONTENT_TEXT) {
                newObject = "";
            } else if (columnProps.field === FIELD.CONTENT) {
                newObject = {};
            } else if (columnProps.field !== FIELD.MAP_KEY) {
                ObjectUtils.setValue(newObject, columnProps.field, undefined);
            }
        });
        return newObject;
    }

    handleInsertNewElement() {

        switch (this.props.set.type) {
            case SET_TYPES.SEQUENTIAL_MAP:

                let keys = Object.keys(this.props.dataSource).sort(function (a, b) {
                    return Number(a) - Number(b);
                });
                if (keys.length > 0 && ((this.props.set.maxLength && this.props.set.maxLength > keys.length) || !this.props.set.maxLength)) {
                    var last = keys[keys.length - 1];

                    last++;
                    if (this.props.set.copyLastOnInsertion) {
                        if (this.props.dataSource[last - 1] instanceof Array) {
                            this.props.dataSource[last] = _.cloneDeep(this.props.dataSource[last - 1]);
                        } else if (typeof this.props.dataSource[last - 1] === "string" || typeof this.props.dataSource[last - 1] === "number") {
                            this.props.dataSource[last] = _.cloneDeep(this.props.dataSource[last - 1]);
                        } else {
                            this.props.dataSource[last] = _.cloneDeep(this.props.dataSource[last - 1]);
                        }
                    } else {
                        this.props.dataSource[last] = this.generateNewObject();
                    }
                } else {
                    this.props.dataSource[this.props.set.defaultKey || 0] = this.generateNewObject();
                }

                break;
            case SET_TYPES.MAP:

                let mapKeys = Object.keys(this.props.dataSource).sort();
                if (mapKeys.length > 0) {
                    var lastKey = mapKeys[mapKeys.length - 1];

                    if (typeof this.props.set.defaultKey === "number") {
                        lastKey = Number(lastKey);
                    }

                    var newKey = lastKey;
                    if (typeof lastKey === "string") {
                        newKey += " New";
                    } else {
                        newKey += 1;
                    }
                    if (this.props.set.copyLastOnInsertion) {
                        if (this.props.dataSource[lastKey] instanceof Array) {
                            this.props.dataSource[newKey] = _.cloneDeep(this.props.dataSource[lastKey]);
                        } else if (typeof this.props.dataSource[lastKey] === "string" || typeof this.props.dataSource[lastKey] === "number") {
                            this.props.dataSource[newKey] = _.cloneDeep(this.props.dataSource[lastKey]);
                        } else {
                            this.props.dataSource[newKey] = _.cloneDeep(this.props.dataSource[lastKey]);
                        }
                    } else {
                        this.props.dataSource[newKey] = this.generateNewObject();
                    }
                } else {
                    this.props.dataSource[this.props.set.defaultKey || "new"] = this.generateNewObject();
                }

                break;
            default:
                this.props.dataSource.push(this.generateNewObject());
        }
        if (this.props.onChangeCallback !== undefined) {
            this.props.onChangeCallback(this.props.dataSource.length - 1, undefined, "ADD");
        }
        this.setState({});
    }

    refreshRefsWithProperties() {
        Object.values(this.refs).forEach((fieldRef) => {
            if (fieldRef && "reloadField" in fieldRef) {
                fieldRef.reloadField();
            }
        });
    }

    render() {

        if (this.props.dispatcher) {
            this.props.dispatcher.subscribe(this.props.id, () => {
                this.setState({})
            });
        }

        let label = this.props.label ? <div className="column is-full"><h5 className="title is-5">{this.props.label}</h5></div> : "";
        let insertButton = "";
        if (this.props.set.insertData) {

            var addInsertButton = true;
            if (this.props.set.maxLength) {
                if (this.props.set.type === SET_TYPES.ARRAY) {
                    addInsertButton = this.props.dataSource.length < this.props.set.maxLength;
                } else {
                    addInsertButton = Object.keys(this.props.dataSource).length < this.props.set.maxLength;
                }
            }

            if (addInsertButton) {
                insertButton = <div className="column is-full">
                    <button className="button is-primary is-small"
                            onClick={this.handleInsertNewElement}>
                        Add
                    </button>
                </div>;
            }
        }

        return (
            <div id={this.props.id} className="data-set">
                <div className="columns">
                    <div className="column is-full">
                        {label}
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-full">
                        <table className="table" style={{width: "100%"}}>
                            <thead>
                            {
                                this.renderTableHead()
                            }
                            </thead>
                            <tbody>
                            {
                                this.renderTableBody()
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="columns">
                    {insertButton}
                </div>
            </div>
        );
    }

    renderTableHead() {
        let self = this;
        let columns = [];
        this.props.set.columns.forEach(function (columnProps) {
            let width = columnProps.width || self.columnArea;
            columns.push(<th key={columnProps.field} width={width + "%"}>{columnProps.label}</th>);
        });
        if (this.props.set.removeData) {
            columns.push(<th key="RemoveDataColumn" width="3%"></th>);
        }

        return (
            <tr>
                {columns}
            </tr>
        );
    }

    renderTableBody() {

        let elements = [];
        let self = this;

        switch (this.props.set.type) {
            case SET_TYPES.SEQUENTIAL_MAP:
                for (var key in this.props.dataSource) {
                    elements.push(<tr key={key}
                                      data-element={key}>{this.columnsForData(this.props.dataSource[key], key)}</tr>);
                }

                break;
            case SET_TYPES.MAP:
                let keyList = Object.keys(this.props.dataSource);

                let orderedKeyList;
                if (this.props.customKeySortFunc) {
                    orderedKeyList = keyList.sort(this.props.customKeySortFunc);
                } else if (this.props.set.sortFieldType) {
                    let sortType = this.props.set.sortFieldType;
                    orderedKeyList = keyList.sort((a, b) => {
                        if (sortType === FIELD_TYPES.NUMBER) {
                            let numberA = Number(a);
                            let numberB = Number(b);
                            return numberA - numberB;
                        } else {
                            return a.localeCompare(b);
                        }
                    });
                } else {
                    orderedKeyList = keyList.sort();
                }

                orderedKeyList.forEach(function (mapKey) {
                    if (!self.keyMap[mapKey]) {
                        self.keyMap[mapKey] = mapKey;
                    }

                    elements.push(<tr key={self.keyMap[mapKey]}
                                      data-element={mapKey}>{self.columnsForData(self.props.dataSource[mapKey], mapKey, self.keyMap[mapKey])}</tr>);
                });

                break;
            default:
                var sortType = this.props.set.sortFieldType;
                var sortField = this.props.set.sortField;
                if (this.props.set.sortField) {
                    this.props.dataSource.sort(function (a, b) {
                        if (sortType === FIELD_TYPES.NUMBER) {
                            let numberA = Number(ObjectUtils.getValue(a, sortField)) || Number.MAX_SAFE_INTEGER;
                            let numberB = Number(ObjectUtils.getValue(b, sortField)) || Number.MAX_SAFE_INTEGER;
                            return numberA - numberB;
                        } else {
                            return a[ObjectUtils.getValue(a, sortField)].localeCompare(ObjectUtils.getValue(b, sortField));
                        }
                    })
                }

                this.props.dataSource.forEach(function (elementData, index) {
                    elements.push(<tr key={sortField ? elementData[sortField] + "_" + index : index}
                                      data-element={index}>{self.columnsForData(elementData, index)}</tr>);
                });

        }
        return (elements);
    }

    columnsForData(elementData, elementId, elementKey) {
        let columns = [];
        let self = this;
        this.props.set.columns.forEach(function (columnProps) {

            let column;
            let source = {elementId: elementId, field: columnProps.field};

            let value = elementData;
            let property = columnProps.field;

            if (columnProps.field === FIELD.MAP_KEY) {
                value = elementId;
            }
            if (columnProps.field === FIELD.MAP_KEY ||
                columnProps.field === FIELD.CONTENT_TEXT ||
                columnProps.field === FIELD.CONTENT_ARRAY ||
                columnProps.field === FIELD.CONTENT) {
                property = undefined;
            }

            switch (columnProps.type) {
                case FIELD_TYPES.LABEL:
                    value = ObjectUtils.getValue(elementData, columnProps.field);
                    column = <label>{value}</label>;
                    break;
                case FIELD_TYPES.TEXT:
                    column = <InputText id={"el-" + columnProps.field + "-" + elementId}
                                        ref={"el-" + columnProps.field + "-" + elementId}
                                        source={source}
                                        entry={value}
                                        property={property}
                                        applyOnBlur={false}
                                        validateChange={self.validateFieldChange}
                                        onChange={self.handleChangeElementField}/>;
                    break;
                case FIELD_TYPES.NUMBER:
                    column = <InputNumber id={"el-" + columnProps.field + "-" + elementId}
                                          ref={"el-" + columnProps.field + "-" + elementId}
                                          source={source}
                                          entry={value}
                                          property={property}
                                          applyOnBlur={true}
                                          validateChange={self.validateFieldChange}
                                          onChange={self.handleChangeElementField}/>;
                    break;
                // case FieldTypes.PAIR:
                //     if (!value) {
                //         elementData[columnProps.field] = {};
                //     }
                //     column = self.renderPair(elementId, columnProps, value);
                //
                //     break;
            }


            let width = columnProps.width || self.columnArea;
            if (columnProps.field === "MAP_KEY") {
                columns.push(<th key={"el-" + (elementKey || elementId) + "-" + columnProps.field}
                                 onClick={() => {
                                     if (self.props.onClickOnElementCallback) {
                                         self.props.onClickOnElementCallback(value);
                                     }
                                 }}
                                 width={width + "%"}>{column}</th>);
            } else {
                columns.push(<th key={"el-" + elementId + "-" + columnProps.field}
                                 onClick={() => {
                                     if (self.props.onClickOnElementCallback) {
                                         self.props.onClickOnElementCallback(value);
                                     }
                                 }}
                                 width={width + "%"}>{column}</th>);
            }

        });
        if (this.props.set.removeData) {
            columns.push(
                <th key={"el-" + (elementKey || elementId) + "-RemoveDataColumn"} width="3%">
                    <a className="delete" data-removeid={elementId}
                       onClick={this.handleRemoveElement}>
                    </a>
                </th>
            );
        }

        return columns;
    }

    // renderPair(elementId, columnProps, value) {
    //     let self = this;
    //     function renderSide(elementId, columnProps, value, side) {
    //         let sideProps = _.cloneDeep(columnProps.pair[side]);
    //
    //         switch (columnProps.pair[side].type) {
    //             case FIELD_TYPES.NUMBER:
    //                 if (columnProps.field.indexOf("CONTENT") < 0) {
    //                     sideProps.field = columnProps.field + "." + sideProps.field;
    //                 }
    //                 return self.renderNumber({side: side, elementId: elementId}, sideProps, value[columnProps.pair[side].field]);
    //             default:
    //                 console.log("Type not defined in PAIR yet");
    //         }
    //     }
    //
    //     let leftField = renderSide(elementId, columnProps, value, "left");
    //     let rightField = renderSide(elementId, columnProps, value, "right");
    //
    //     return (
    //         <div className="pair-column">
    //             {leftField}
    //             {rightField}
    //         </div>
    //     );
    // }

    // preparePairElementIdAndSource(element, columnProps) {
    //     let source = {field: columnProps.field};
    //     let elementId = element;
    //     if (element.side) {
    //         source.elementId = element.elementId;
    //         source.side = element.side;
    //         elementId = element.elementId;
    //     } else {
    //         source.elementId = element;
    //     }
    //     return [elementId, source];
    // }

    // renderNumber(element, columnProps, value) {
    //     let elementId, source;
    //     [elementId, source] = this.preparePairElementIdAndSource(element, columnProps);
    //
    //     return (
    //         <InputNumberField id={"el-" + columnProps.field + "-" + elementId}
    //                           ref={"el-" + columnProps.field + "-" + elementId}
    //                           value={value}
    //                           applyOnBlur={true}
    //                           disabled={columnProps.disabled}
    //                           source={source}
    //                           onChange={this.handleChangeElementField}/>
    //     );
    // }
}

DataSet.propTypes = {
    id: PropTypes.string.isRequired,
    dispatcher: PropTypes.object,
    label: PropTypes.string,
    dataSource: PropTypes.any.isRequired,
    store: PropTypes.object,
    set: PropTypes.object.isRequired,
    onChangeCallback: PropTypes.func,
    onClickOnElementCallback: PropTypes.func,
    isScrollable: PropTypes.bool,
    customKeySortFunc: PropTypes.func,
};

export default DataSet;

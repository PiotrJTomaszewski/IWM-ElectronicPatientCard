import React from "react";
import Form from "react-bootstrap/Form";
import FormCheck from "react-bootstrap/FormCheck";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import GraphComponent from "./GraphComponent";
import DateRangeComponent from "../../DateRangeComponent";
import ObservationModel from "../../../models/ObservationModel";

class GraphsMain extends React.Component {
  state = {
    dataReady: false,
    radioButtons: {},
    interestingData: {},
    graphDrawn: false,
    selectedDataType: undefined,
    dataToPlot: {},
    dateRange: null,
  };

  constructor(props) {
    super(props);
  }

  getDataTypeOptions(codes) {
    var options = [];
    for (var c in codes) {
      var code = codes[c];
      options.push(
        <option key={"DT" + code.coding.code} value={code.coding.code}>
          {code.text}
        </option>
      );
    }
    return options;
  }

  componentDidMount() {
    var observations = this.props.fhirClient.patientData.observations.map(
      (multiverObs) => multiverObs.getLast()
    );
    if (observations && observations.length > 0) {
      var interestingData = observations.filter((obs) => {
        return obs.valueType === ObservationModel.valueType["valueQuantity"];
      });
      var codes = {};
      interestingData.forEach((data) => {
        codes[data.code.coding.code] = data.code;
      });
      var options = this.getDataTypeOptions(codes);
      this.setState((state) => {
        return {
          ...state,
          dataTypeOptions: options,
          interestingData: interestingData,
          dataReady: true,
        };
      });
    }
  }

  selectedDataTypeHandler = (event) => {
    var selectedDataType;
    if (event.target) {
      selectedDataType = event.target.value;
      if (selectedDataType) {
        var selectedData = this.state.interestingData.filter((data) => {
          return data.code.coding.code === selectedDataType;
        });
        var graphData = {
          unitY: selectedData[0].valueQuantity.unit,
          coords: [],
        };
        for (var data of selectedData) {
          graphData.coords.push({
            x: new Date(data.issued),
            y: data.valueQuantity.value,
          });
        }
        graphData.coords.sort((a, b) => {
          return a.x.getTime() - b.x.getTime();
        });

        var dateRange = [
          graphData.coords[0].x,
          graphData.coords[graphData.coords.length - 1].x,
        ];

        this.setState((state) => {
          return {
            ...state,
            renderPlot: true,
            dataToPlot: graphData,
            dateRange: dateRange,
            defaultDateRange: dateRange,
            selectedDataType: selectedDataType,
          };
        });
      }
    }
  };

  dateRangeComponentOnChange = (newDateRange) => {
    console.log(newDateRange);
    this.setState((oldState) => {
      return {
        dateRange: newDateRange ? newDateRange : oldState.defaultDateRange,
      };
    });
  };

  dateRangeGraphOnChange = (newDateRange) => {
    var left = newDateRange[0];
    var right = newDateRange[1];

    this.setState((oldState) => {
      return {
        dateRange: [
          left ? left : oldState.defaultDateRange[0],
          right ? right : oldState.defaultDateRange[1],
        ],
      };
    });
  };

  render() {
    if (this.state.dataReady) {
      return (
        <Container>
          <Form>
            <Form.Group controlId="dataType" />
            <Form.Label>
              <div className="display-2">Select parameter to visualize</div>
            </Form.Label>
            <Form.Control
              as="select"
              id="dataTypeSelection"
              onChange={this.selectedDataTypeHandler.bind(this)}
              value={this.state.selectedDataType}
            >
              <option value="">Select data type</option>
              {this.state.dataTypeOptions}
            </Form.Control>
          </Form>

          {this.state.renderPlot ? (
            <div className="graph-container">
              <GraphComponent
                data={this.state.dataToPlot}
                dateRange={this.state.dateRange}
                parentOnRangeChange={this.dateRangeGraphOnChange}
              />
              <DateRangeComponent
                dateRange={this.state.dateRange}
                minMaxDateRange={this.state.defaultDateRange}
                parentOnChange={this.dateRangeComponentOnChange}
              />
            </div>
          ) : null}
        </Container>
      );
    }
    return (
      <div>
        <span className="display-2">
          Sorry, there is no supported data available
        </span>
      </div>
    );
  }
}

export default GraphsMain;

import React from "react";
import Form from "react-bootstrap/Form";
import FormCheck from "react-bootstrap/FormCheck";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import GraphComponent from "./GraphComponent";

class GraphsMain extends React.Component {
  state = {
    dataReady: false,
    graphDrawn: false,
    dataToPlot: {}
  };

  selectedDataType = undefined;

  data = {
    wasAnyDataFound: false,
    height: { title: "Height", coords: [], unitY: "" },
    weight: { title: "Weight", coords: [], unitY: "" },
    respirationRate: { title: "Respiration Rate", coords: [], unitY: "" },
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.observations && this.props.observations.length > 0) {
      // Height - 8302-2
      // Weight - 29463-7
      // Respiration rate - 9279-1
      // Blood pressure (sitting)
      // Blood pressure (standing)
      // Temperature
      // Heart rate
      var observation;
      for (observation of this.props.observations) {
        var code = observation.getCode().code;
        var value = observation.getValue();
        var dateTime = observation.getEffectiveDateTime();
        if (value && value.type === "quantity" && dateTime) {
          dateTime = new Date(dateTime);
          console.log(value, dateTime);
          switch (code) {
            case "8302-2": // Height
              this.data.wasAnyDataFound = true;
              this.data.height.coords.push({ x: dateTime, y: value.value });
              this.data.height.unitX = value.unit;
              break;
            case "29463-7": // Weight
              this.data.wasAnyDataFound = true;
              this.data.weight.coords.push({ x: dateTime, y: value.value });
              this.data.weight.unitX = value.unit;
              break;
            case "9279-1": // Respiration rate
              this.data.wasAnyDataFound = true;
              this.data.respirationRate.coords.push({
                x: dateTime,
                y: value.value,
              });
              this.data.respirationRate.unitX = value.unit;
              break;
            default:
              break;
          }
        }
      }
    }
    this.setState((state) => {
      return {
        ...state,
        dataReady: true,
      };
    });
  }

  selectedDataTypeHandler = (event) => {
    switch (event.target.id) {
      case "heightOption":
        this.selectedDataType = 'height';
        break;
      case "weightOption":
        this.selectedDataType = 'weight';
        break;
      case "respirationRateOption":
        this.selectedDataType = 'respirationRate';
        break;
      default:
        break;
    }
  };

  onSubmitClick = () => {
    if (this.selectedDataType) {
      var selectedData;
      switch(this.selectedDataType) {
        case 'height': selectedData = this.data.height; break;
        case 'weight': selectedData = this.data.weight; break;
        case 'respirationRate': selectedData = this.data.respirationRate; break;
        default: break;
      }
      selectedData.coords.sort((a,b)=>{
        return a.x.getTime()-b.x.getTime();
      });
      this.setState((state) => {
        return {
          ...state,
          dataReady: true,
          graphDrawn: true,
          dataToPlot: selectedData
        };
      });
    }
  };

  render() {
    if (this.state.dataReady) {
      if (this.data.wasAnyDataFound) {
        return (
          <Container>
            <Form>
              <Form.Group controlId="dataType" />
              <Form.Label>Select data type to visualize</Form.Label>
              <div onChange={this.selectedDataTypeHandler.bind(this)}>
                {this.data.height.coords.length > 0 ? (
                  <FormCheck
                    type="radio"
                    label="Height"
                    id="heightOption"
                    name="dataType"
                  />
                ) : null}
                {this.data.weight.coords.length > 0 ? (
                  <FormCheck
                    type="radio"
                    label="Weight"
                    id="weightOption"
                    name="dataType"
                  />
                ) : null}
                {this.data.respirationRate.coords.length > 0 ? (
                  <FormCheck
                    type="radio"
                    label="Respiration Rate"
                    id="respirationRateOption"
                    name="dataType"
                  />
                ) : null}
              </div>
              <Button type="button" onClick={this.onSubmitClick}>
                Draw Graph
              </Button>
            </Form>
            {this.state.graphDrawn ? (
              <GraphComponent data={this.state.dataToPlot} />
            ) : null}
          </Container>
        );
      }
      return (
        <span className="display-2">
          Sorry, there is no supported data available
        </span>
      );
    }
    return <div></div>;
  }
}

export default GraphsMain;

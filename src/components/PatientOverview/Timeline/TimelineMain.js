import React from "react";
import Button from "react-bootstrap/Button";
import TimelineComponent from "./TimelineComponent";
import Loading from "../../Loading";
import DateRangeComponent from "../../DateRangeComponent";
import ModalWithButton from "../ModalWithButton";

var Immutable = require("seamless-immutable");

class TimelineMain extends React.Component {

  constructor(props) {
    super(props);
    this.groups = [
      { id: "groupMedicationsId", content: "Medications", nestedGroups: [] },
      { id: "gruoupObservationsId", content: "Observations", nestedGroups: [] },
    ];
    this.items = [];
    this.state = {
      dataReady: false,
      groups: this.immutableGroups,
      items: this.immutableItems,
      minViewDate: new Date(),
      maxViewDate: new Date(),
      minDataDate: new Date(),
      maxDataDate: new Date(),
      currentDateRange: [new Date(), new Date()],
    };
  }

  componentDidMount() {
    this.items = [];
    this.fillObservationGroups();
    var obsMinmax = this.fillObservationItems();
    this.fillMedicationGroups();
    var medMinmax = this.fillMedicationItems();
    this.immutableGroups = Immutable(this.groups);
    this.immutableItems = Immutable(this.items);
    var minDataDate = obsMinmax[0] < medMinmax[0] ? obsMinmax[0] : medMinmax[0];
    var maxDataDate = obsMinmax[1] > medMinmax[1] ? obsMinmax[1] : medMinmax[1];
    var minDate = new Date();
    minDate.setFullYear(minDataDate.getFullYear() - 1);
    const maxDate = new Date();
    maxDate.setFullYear(maxDataDate.getFullYear() + 1);
    this.setState((state) => {
      return {
        dataReady: true,
        groups: this.immutableGroups,
        items: this.immutableItems,
        minViewDate: minDate,
        maxViewDate: maxDate,
        minDataDate: minDataDate,
        maxDataDate: maxDataDate,
        currentDateRange: [minDate, maxDate],
      };
    });
  }

  fillMedicationGroups() {
    var medicationRequests = this.props.fhirClient.patientData.medicationRequests;
    var medicationCodes = [];
    var request;
    var requestMultiVer;
    for (requestMultiVer of medicationRequests) {
      request = requestMultiVer.getLast();
      var medicationCode = request.medicationCodeableConcept;
      if (medicationCodes.indexOf(medicationCode.coding.code) === -1) {
        medicationCodes.push(medicationCode.coding.code);
        this.groups.push({
          id: medicationCode.coding.code,
          content: request.toText(),
        });
        this.groups[0].nestedGroups.push(medicationCode.coding.code);
      }
    }
  }

  fillMedicationItems() {
    var minDataDate = new Date();
    var maxDataDate = new Date();
    var request;
    this.props.fhirClient.patientData.medicationRequests.forEach((requestMultiVer) => {
      request = requestMultiVer.getLast();
      var authoredOnDate = new Date(request.authoredOn);
      if (authoredOnDate > maxDataDate) {
        maxDataDate = authoredOnDate;
      } else if (authoredOnDate < minDataDate) {
        minDataDate = authoredOnDate;
      }
      // var start_time = new Date();
      // var end_time = this.maxDate;
      // console.log(period);
      // if (period[0]) {
      //   start_time = new Date(period[0]);
      // }
      // if (period[1]) {
      //   end_time = new Date(period[1]);
      // }
      this.items.push({
        id: request.id,
        localId: requestMultiVer.localId,
        type: "MedicationRequest",
        timelineItem: {
          id: request.id,
          group: request.medicationCodeableConcept.coding.code,
          content: request.toText(),
          start: authoredOnDate,
          end: authoredOnDate,
          // end: end_time,
          type: "point",
        },
      });
    });
    return [minDataDate, maxDataDate];
  }

  fillObservationGroups() {
    var observations = this.props.fhirClient.patientData.observations;
    var obseravionCodes = [];
    var observation;
    var observationMultiVer;
    for (observationMultiVer of observations) {
      observation = observationMultiVer.getLast();
      var code = observation.code;
      if (obseravionCodes.indexOf(code.coding.code) === -1) {
        obseravionCodes.push(code.coding.code);
        this.groups.push({
          id: code.coding.code,
          content: code.text,
        });
        this.groups[1].nestedGroups.push(code.coding.code);
      }
    }
  }

  fillObservationItems() {
    var minDataDate = new Date();
    var maxDataDate = new Date();
    var observation;
    this.props.fhirClient.patientData.observations.forEach((observationMultiVer) => {
      observation = observationMultiVer.getLast();
      var datetime = new Date(observation.issued);
      if (datetime > maxDataDate) {
        maxDataDate = datetime;
      } else if (datetime < minDataDate) {
        minDataDate = datetime;
      }
      this.items.push({
        id: observation.id,
        localId: observationMultiVer.localId,
        type: "Observation",
        timelineItem: {
          id: observation.id,
          group: observation.code.coding.code,
          content: observation.getValueText(true),
          start: datetime,
          type: "point",
        },
      });
    });
    return [minDataDate, maxDataDate];
  }

  dateRangeOnCalendarChange = (newDateRange) => {
    this.setState({
      currentDateRange: newDateRange,
    });
  };

  clearDateRangeButtonClick = () => {
    this.setState((oldState) => {
      return {
        currentDateRange: [oldState.minViewDate, oldState.maxViewDate],
      };
    });
  };

  render() {
    // var timelineOptions = Immutable({orientation: {axis: 'both'}});
    var timelineOptions = Immutable({
      min: this.state.currentDateRange[0],
      max: this.state.currentDateRange[1],
      orientation: {axis: 'both'}
    });
    if (this.state.dataReady) {
      return (
        <div>
          <ModalWithButton
            buttonVariant={"primary"}
            buttonText={"Choose date range"}
            buttonClass={"dateRangeModalButton"}
            size={"lg"}
            modalTitle={"Choose date range"}
            modalBody={
              <div className="timelineModalBody">
              <DateRangeComponent
                dateRange={this.state.currentDateRange}
                minMaxDateRange={[this.state.minDataDate, this.state.maxDataDate]}
                parentOnChange={this.dateRangeOnCalendarChange}
              /></div>
            }
          ></ModalWithButton>

          <Button
            variant="primary"
            className="clearRangeButton"
            onClick={this.clearDateRangeButtonClick}
          >
            Clear date range
          </Button>
          
          <span className="fixed-to-right">Shitft+Click on entry to see details</span>

          <TimelineComponent
            options={timelineOptions}
            groups={this.state.groups}
            items={this.state.items}
            fhirClient={this.props.fhirClient}
          />
        </div>
      );
    }
    return <Loading />;
  }
}

export default TimelineMain;

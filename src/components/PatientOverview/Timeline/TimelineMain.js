import React from "react";
import TimelineComponent from "./TimelineComponent";
import Loading from "../../Loading";
import {capitalizeFirstLetter} from "../../../Helpers";
import RawHtml from "../../RawHtml";

var Immutable = require("seamless-immutable");


class TimelineMain extends React.Component {
  maxDate = new Date("2030-12-12");
  state = {
    dataReady: false,
    groups: undefined,
    items: undefined,
  };

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
    };
  }

  componentDidMount() {
    this.items = []
    this.fillObservationGroups();
    this.fillObservationItems();
    this.fillMedicationGroups();
    this.fillMedicationItems();
    this.immutableGroups = Immutable(this.groups);
    this.immutableItems = Immutable(this.items);
    this.setState((state)=>{
      return {
        dataReady: true,
        groups: this.immutableGroups,
        items: this.immutableItems
      }
    })
  }

  fillMedicationGroups() {
    var medicationRequests = this.props.fhirClient.patientData.medicationRequests;
    var medicationCodes = [];
    var request;
    for (request of medicationRequests) {
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

  getRequestModalBody(request) {
    return (
      <dl>
        <dt>Authored on</dt>
        <dd>{new Date(request.authoredOn).toLocaleString("en-US")}</dd>
        <dt>Intent</dt>
        <dd>{capitalizeFirstLetter(request.intent)}</dd>
        <dt>Dosage</dt>
        <dd><RawHtml>{request.getDosageHtml()}</RawHtml></dd>
        <dt>Status</dt>
        <dd>{request.status}</dd>
        <dt>Requester</dt>
        <dd>{request.requester}</dd>
      </dl>
    );
  }

  fillMedicationItems() {
    this.props.fhirClient.patientData.medicationRequests.forEach((request) => {
      var authoredOnDate = new Date(request.authoredOn);
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
        modalTitle: request.toText(),
        modalHeader: "",
        modalBody: this.getRequestModalBody(request),
        item: {
          id: request.id,
          group: request.medicationCodeableConcept.coding.code,
          content: request.toText(),
          start: authoredOnDate,
          // end: end_time,
          type: "point",
        },
      });
    });
  }

  fillObservationGroups() {
    var observations = this.props.fhirClient.patientData.observations;
    var obseravionCodes = [];
    var observation;
    for (observation of observations) {
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

  getObservationModalBody(observation) {
    return (
      <dl>
        <dt>Status</dt>
        <dd>{observation.status}</dd>
        <dt>Issued</dt>
        <dd>{observation.issued ? new Date(observation.issued).toLocaleString("en-US") : ""}</dd>
        <dt>Effective Date Time</dt>
        <dd>{observation.effectiveDateTime ? new Date(observation.effectiveDateTime).toLocaleString("en-US") : ""}</dd>
        <dt>Value</dt>
        <dd>{observation.getValueText(false)}</dd>
      </dl>
    );
  }

  fillObservationItems() {
    this.props.fhirClient.patientData.observations.forEach((observation) => {
      var datetime = new Date(observation.issued);
      this.items.push({
        id: observation.id,
        modalTitle: observation.code.text,
        modalHeader: observation.category.toText(),
        modalBody: this.getObservationModalBody(observation),
        item: {
          id: observation.id,
          group: observation.code.coding.code,
          content: observation.getValueText(true),
          start: datetime,
          type: "point",
        },
      });
    });
  }

  render() {
    // var timelineOptions = Immutable({orientation: {axis: 'both'}});
    var timelineOptions = Immutable({});
    if (this.state.dataReady) {
      return (
        <div>
          <TimelineComponent
            options={timelineOptions}
            groups={this.state.groups}
            items={this.state.items}
          />
        </div>
      );
    }
    return <Loading/>;
  }
}

export default TimelineMain;

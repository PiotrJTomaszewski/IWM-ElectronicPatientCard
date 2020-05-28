import React from "react";
import Container from "react-bootstrap/Container";
import TimelineComponent from "./TimelineComponent";
import RawHtml from "../../RawHtml";
var Immutable = require("seamless-immutable");

class TimelineMain extends React.Component {
  maxDate = new Date("2030-12-12");

  constructor(props) {
    super(props);
    this.groups = [
      { id: "groupMedicationsId", content: "Medications", nestedGroups: [] },
      { id: "gruoupObservationsId", content: "Observations", nestedGroups: [] }
    ];
    this.items = [];
    this.fillMedicationGroups();
    this.fillMedicationItems();
    this.fillObservationGroups();
    this.fillObservationItems();
    // this.groups = Immutable(
    //   this.getMedicationGroups().concat(this.getObservationGroups())
    // );
    // this.items = Immutable(
    //   this.getMedicationItems().concat(this.getObservationItems())
    // );
    this.immutableGroups = Immutable(this.groups);
    this.immutableItems = Immutable(this.items);
  }

  fillMedicationGroups() {
    var medicationStatemets = this.props.medicationStatements;
    var medicationReferences = [];
    var statement;
    for (statement of medicationStatemets) {
      var reference = statement.getMedicationReference("Unknown");
      if (medicationReferences.indexOf(reference.reference) === -1) {
        medicationReferences.push(reference.reference);
        this.groups.push({
          id: reference.reference,
          content: reference.display,
        });
        this.groups[0].nestedGroups.push(reference.reference);
      }
    }
  }

  fillMedicationItems() {
    this.props.medicationStatements.map((statement) => {
      var period = statement.getEffectivePeriod(false, undefined);
      var start_time = new Date();
      var end_time = this.maxDate;
      console.log(period);
      if (period[0]) {
        start_time = new Date(period[0]);
      }
      if (period[1]) {
        end_time = new Date(period[1]);
      }
      this.items.push({
        id: statement.getId(),
        group: statement.getMedicationReference("Unknown").reference,
        content: statement.getText("Unknown"),
        start: start_time,
        end: end_time,
      });
    });
  }

  fillObservationGroups() {
    var observations = this.props.observations;
    var obseravionCodes = [];
    var observation;
    for (observation of observations) {
      var code = observation.getCode("Unknown");
      if (obseravionCodes.indexOf(code.code) === -1) {
        obseravionCodes.push(code.code);
        this.groups.push({
          id: code.code,
          content: code.display,
        });
        this.groups[1].nestedGroups.push(code.code);
      }
    }
  }

  fillObservationItems() {
    this.props.observations.map((observation) => {
      var datetime = new Date(observation.getEffectiveDateTime(undefined));
      this.items.push({
        id: observation.getId(),
        group: observation.getCode("Unknown").code,
        content: observation.getText("Unknown"),
        start: datetime,
        type: "point",
      });
    });
  }

  render() {
    console.log(this.props.medicationStatements, this.props.observations);

    // var groups = Immutable(this.getMedicationGroups());
    // var items = Immutable(this.getMedicationItems());
    var timelineOptions = Immutable({});
    console.log(
      this.immutableGroups,
      this.immutableItems,
      this.timelineOptions
    );
    return (
      <div>
        <TimelineComponent
          options={timelineOptions}
          groups={this.immutableGroups}
          items={this.immutableItems}
        />
      </div>
    );
  }
}

export default TimelineMain;

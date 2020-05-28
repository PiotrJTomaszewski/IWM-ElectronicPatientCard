// import React from "react";
// import Container from "react-bootstrap/Container";
// import Timeline from "react-calendar-timeline";
// import "react-calendar-timeline/lib/Timeline.css";
// import moment from "moment";

// import RawHtml from "../../RawHtml";

// class TimelineMain extends React.Component {

//   getMedicationGroups() {
//     var medicationStatemets = this.props.medicationStatements;
//     var medicationReferences = [];
//     var medicationGroups = [];
//     var statement;
//     for (statement of medicationStatemets) {
//       // if (medication) indexOf ===-1
//       var reference = statement.getMedicationReference("Unknown");
//       if (medicationReferences.indexOf(reference.reference) === -1) {
//         medicationReferences.push(reference.reference);
//         medicationGroups.push({
//           id: reference.reference,
//           title: reference.display,
//           stackItems: true,
//           height: 60,
//         });
//       }
//     }
//     return medicationGroups;
//   }

//   getMedicationItems() {
//     return this.props.medicationStatements.map((statement) => {
//       var period = statement.getEffectivePeriod(false, undefined);
//       var start_time = 0;
//       var end_time = new Date().getTime();
//       console.log(period);
//       if (period[0]) {
//         start_time = new Date(period[0]).getTime();
//       }
//       if (period[1]) {
//         end_time = new Date(period[1]).getTime();
//       }
//       return {
//         id: statement.getId(),
//         group: statement.getMedicationReference("Unknown").reference,
//         title: <RawHtml>{statement.getText("Unknown")}</RawHtml>,
//         start_time: start_time,
//         end_time: end_time,
//         canMove: false,
//         canResize: false,
//         canChangeGroup: false,
//       };
//     });
//   }

//   getObservationGroups() {
//     var observations = this.props.observations;
//     var obseravionCodes = [];
//     var observationGroups = [];
//     var observation;
//     for (observation of observations) {
//       var code = observation.getCode("Unknown");
//       if (obseravionCodes.indexOf(code.code) === -1) {
//         obseravionCodes.push(code.code);
//         observationGroups.push({
//           id: code.code,
//           title: code.display,
//           height: 60,
//         });
//       }
//     }
//     return observationGroups
//   }

//   getObservationItems() {
//     return this.props.observations.map((observation) => {
//       var datetime = new Date(observation.getEffectiveDateTime(undefined)).getTime();
//       return {
//         id: observation.getId(),
//         group: observation.getCode().code,
//         title: <RawHtml>{observation.getText('Unknown')}</RawHtml>,
//         start_time: datetime,
//         end_time: datetime+60*60*1000,
//         canMove: false,
//         canResize: false,
//         canChangeGroup: false
//       }
//     })
//   }

//   render() {
//     console.log(this.props.medicationStatements, this.props.observations);
//     var groups = this.getMedicationGroups().concat(this.getObservationGroups())
//     var items = this.getMedicationItems().concat(this.getObservationItems())
//     return (
//       <div>
//         <Timeline
//           groups={groups}
//           defaultTimeStart={moment().add(-12, "hour")}
//           defaultTimeEnd={moment().add(12, "hour")}
//           items={items}
//           sidebarWidth={300}
//         />
//       </div>
//     );
//   }
// }

// export default TimelineMain;

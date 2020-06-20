import React from "react";

import { capitalizeFirstLetter } from "../../../Helpers";
import VersionControl from "../../VersionControl";

class ObservationModalBody extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      currentVersion: this.props.multiverModel.currentVersion,
      multiverObservation: this.props.multiverModel,
      currentObservation: this.props.multiverModel.getCurrent(),
    };
  }

  versionChangeHandle = (newVersion) => {
    console.log("UPDATE")
    this.setState({
      currentVersion: newVersion,
      currentObservation: this.state.multiverObservation.modelVersions[
        newVersion
      ],
    });
  };

  render() {
    return (
      <div>
        <dl>
          <dt>Status</dt>
          <dd
            className={
              this.state.multiverObservation.isDifferentFromPrev("status")
                ? "modal-field-differ"
                : ""
            }
          >
            {capitalizeFirstLetter(this.state.currentObservation.status)}
          </dd>
          <dt>Issued</dt>
          <dd
            className={
              this.state.multiverObservation.isDifferentFromPrev("issued")
                ? "modal-field-differ"
                : ""
            }
          >
            {this.state.currentObservation.issued
              ? new Date(this.state.currentObservation.issued).toLocaleString(
                  "en-US"
                )
              : ""}
          </dd>
          <dt>Effective Date Time</dt>
          <dd
            className={
              this.state.multiverObservation.isDifferentFromPrev(
                "effectiveDateTime"
              )
                ? "modal-field-differ"
                : ""
            }
          >
            {this.state.currentObservation.effectiveDateTime
              ? new Date(
                  this.state.currentObservation.effectiveDateTime
                ).toLocaleString("en-US")
              : ""}
          </dd>
          <dt>Value</dt>
          <dd
            className={
              this.state.multiverObservation.isDifferentFromPrev(
                "valueQuantity"
              ) ||
              this.state.multiverObservation.isDifferentFromPrev(
                "valueCodeableConcept"
              ) ||
              this.state.multiverObservation.isDifferentFromPrev("components")
                ? "modal-field-differ"
                : ""
            }
          >
            {this.state.currentObservation.getValueText(false)}
          </dd>
        </dl>
        <VersionControl
          fhirClient={this.props.fhirClient}
          multiverModel={this.state.multiverObservation}
          currentModelVersion={this.state.currentVersion}
          parentOnVersionChangeHandle={this.versionChangeHandle}
        />
      </div>
    );
  }
}

export default ObservationModalBody;

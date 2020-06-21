import Model from "./Model";
import CodingModel from "./CodingModel";
import MetaModel from "./MetaModel";
import ValueQuantityModel from "./ValueQuantityModel";
import ComponentValueModel from "./ComponentValueModel";
import React from "react";

import RawHtml from "../components/RawHtml";

export default class ObservationModel extends Model {
  static statusCodes = {
    registered: {code: "registered", display: "Registered"},
    preliminary: {code: "preliminary", display: "Preliminary"},
    final: {code: "final", display: "Final"},
    amended: {code: "amended", display: "Amended"},
    corrected: {code: "corrected", display: "Corrected"},
    cancelled: {code: "cancelled", display: "Cancelled"},
    enteredInError: {code: "entered-in-error", display: "Entered in Error"},
    unknown: {code: "Unknown", display: "Unknown"}
  }
  static valueType = {
    valueQuantity: 0,
    valueCodeableConcept: 1,
    valueComponents: 2,
  };
  constructor(resource) {
    super();
    this.category = new CodingModel(this._getPath(resource, "category.0"));
    this.id = this._getPath(resource, "id");
    this.code = {
      coding: new CodingModel(this._getPath(resource, "code")),
      text: this._getPath(resource, "code.text"),
    };
    this.issued = this._getPath(resource, "issued");
    this.meta = new MetaModel(this._getPath(resource, "meta"));
    this.status = this._getPath(resource, "status");
    this.valueType = undefined;
    this.components = [];
    if (this._getPath(resource, "valueQuantity")) {
      this.valueType = ObservationModel.valueType["valueQuantity"];
      this.valueQuantity = new ValueQuantityModel(resource.valueQuantity);
    } else if (this._getPath(resource, "valueCodeableConcept")) {
      this.valueType = ObservationModel.valueType["valueCodeableConcept"];
      this.valueCodeableConcept = {
        coding: new CodingModel(resource.valueCodeableConcept),
        text: this._getPath(resource.valueCodeableConcept, "text"),
      };
    } else if (this._getPath(resource, "component")) {
      this.valueType = ObservationModel.valueType["valueComponents"];
      this.components = this._getPath(resource, "component").map(
        (comp) => new ComponentValueModel(comp)
      );
    }
    this.effectiveDateTime = this._getPath(resource, "effectiveDateTime");
  }

  getValueText(roundNumbers=false, longer=true) {
    var val;
    switch (this.valueType) {
      case ObservationModel.valueType["valueQuantity"]:
        val = this.valueQuantity.toText(roundNumbers);
        break;
      case ObservationModel.valueType["valueCodeableConcept"]:
        val = this.valueCodeableConcept.text;
        break;
      case ObservationModel.valueType["valueComponents"]:
        if (longer) {
          val = this.components
            .map((comp) => comp.text + ": " + comp.getValue(roundNumbers) + " " + comp.getUnit())
            .join("/");
          val = this.components.map((comp) => comp.text).join("/");
          val += "<br/>";
          val += this.components.map((comp) => comp.getValue(roundNumbers) + " " + comp.getUnit()).join("/");
          val = <RawHtml>{val}</RawHtml>;
        } else {
          val = this.components.map((comp) => comp.getValue(roundNumbers) + " " + comp.getUnit()).join("/");
        }
        break;
      default:
        break;
    }
    return val;
  }

  getValue() {
    var val;
    switch (this.valueType) {
      case ObservationModel.valueType["valueQuantity"]:
        val = this.valueQuantity.value;
        break;
      case ObservationModel.valueType["valueCodeableConcept"]:
        // Not implemented
        break;
      case ObservationModel.valueType["valueComponents"]:
        val = this.components.map((comp) => comp.getValue(false));
        break;
      default:
        break;
    }
    return val;
  }

  getCategoryLogo() {
    var logoClass;
    if (this.category) {
      switch(this.category.code) {
        case "social-history":
          logoClass = "fas fa-book-medical";
          break;
        case "vital-signs":
          logoClass = "fas fa-heartbeat";
          break;
        case "imaging":
          logoClass = "fas fa-x-ray";
          break;
        case "laboratory":
          logoClass = "fas fa-vial";
          break;
        case "procedure":
          logoClass = "fas fa-procedures";
          break;
        case "survey":
          logoClass = "fas fa-comment-medical";
          break;
        case "exam":
          logoClass = "fas fa-stethoscope";
          break;
        case "therapy":
          logoClass = "fas fa-medkit";
          break;
        case "activity":
          logoClass = "fas fa-skiing-nordic";
          break;
        default:
          break;
      }
    }
    if (logoClass) {
      return <i className={logoClass+" fa-2x ml-3"} title={this.category.toText()}></i>;
    }
    return this.category.toText();
  }
}

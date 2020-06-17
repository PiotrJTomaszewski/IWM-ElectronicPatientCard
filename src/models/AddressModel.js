import Model from "./Model";

export default class AddressModel extends Model {
  constructor(resource) {
    super();
    this.city = this._getPath(resource, "city");
    this.country = this._getPath(resource, "country");
    this.latLong = {};
    this.setExtensions(resource);
    this.lines = this._getPath(resource, "line");
    this.postalCode = this._getPath(resource, "postalCode");
    this.state = this._getPath(resource, "state");
  }

  setExtensions(resource) {
    var extensions = this._getPath(resource, "extension");
    if (extensions !== undefined && extensions.length > 0) {
      extensions.forEach((element) => {
        const url = this._getPath(element, "url");
        if (url !== undefined) {
          switch (url) {
            case "http://hl7.org/fhir/StructureDefinition/geolocation":
              if (this._getPath(element, "extension") && element.extension.length > 0) {
                element.extension.forEach((latlong) => {
                  if (latlong.url === "latitude") {
                    this.latLong.latitude = latlong.valueDecimal;
                  } else if (latlong.url === "longitude") {
                    this.latLong.longitude = latlong.valueDecimal;
                  }
                });
              }
              break;
            default:
              console.log("Unkown Address extension URL ", url);
              break;
          }
        }
      });
    }
  }

  getShortAddress() {
    return `${this.city} (${this.state})`
  }

  getFullAddressHtml() {
    // var district = this.getDistrict(undefined);
    var html = '<dl>'
    if (this.lines !== undefined) {
      var lines = this.lines.join("<br/>")
      html +=  '<dt>Address lines</dt><dd>' + lines + "</dd>";
    }
    if (this.city !== undefined) {
      html += '<dt>City</dt><dd>' + this.city + "</dd>";
    }
    // if (district !== undefined) {
    //   html += '<dt>District</dt><dd>' + district + "</dd>";
    // }
    if (this.state !== undefined) {
      html += '<dt>State</dt><dd>' + this.state + "</dd>";
    }
    if (this.postalCode !== undefined) {
      html += '<dt>Postal code</dt><dd>' + this.postalCode + '</dd>';
    }
    if (this.country !== undefined) {
      html += '<dt>Country</dt><dd>' + this.country + "</dd>";
    }
    html += "</dl>"
    return html;
  }

}

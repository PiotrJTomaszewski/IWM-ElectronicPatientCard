import Model from "./Model";
import CodingModel from "./CodingModel";
import { capitalizeFirstLetter } from "../Helpers";

export default class DosageInstructionModel extends Model {
  constructor(resource) {
    super();
    this.sequence = this._getPath(resource, "sequence");
    var doseAndRate = this._getPath(resource, "timing.doseAndRate");
    if (doseAndRate) {
      doseAndRate = this._getPath(resource.timing.doseAndRate).map((d) => {
        return {
          type: new CodingModel(d.type),
          doseQuantityValue: d.doseQuantity.value,
        };
      });
    }
    this.timing = {
      repeat: {
        frequency: this._getPath(resource, "timing.repeat.frequency"),
        period: this._getPath(resource, "timing.repeat.period"),
        periodUnit: this._getPath(resource, "timing.repeat.periodUnit"),
      },
      asNeededBoolean: this._getPath(resource, "timing.asNeededBoolean"),
      doseAndRate: doseAndRate,
    };
  }

  toHtml() {
    var html = "<dl>";
    if (this.sequence) {
      html += `<dt class="less-important-item">Sequence</dt><dd>${this.sequence}</dd>`;
    }
    if (this.timing) {
      if (this.timing.repeat) {
        if (this.timing.repeat.frequency) {
          html += `<dt class="less-important-item">Frequency</dt><dd>${this.timing.repeat.frequency}</dd>`;
        }
        if (this.timing.repeat.period) {
          html += `<dt class="less-important-item">Period</dt><dd>${this.timing.repeat.period}`;
          if (this.timing.repeat.periodUnit) {
            html += `[${this.timing.repeat.periodUnit}]`;
          }
          html += "</dd>";
        }
      }
    }
    if (this.asNeededBoolean) {
      html += `<dt class="less-important-item">As Needed</dt><dd>${capitalizeFirstLetter(
        this.timing.asNeededBoolean
      )}</dd>`;
    }
    if (this.doseAndRate) {
      try {
        var dose = this.doseAndRate
          .map((d) => `${d.toText()} ${d.doseQuantityValue}`)
          .join("<br/>");
        html += `<dt class="less-important-item">Dose And Rate</dt><dd>${dose}</dd>`;
      } catch {}
    }
    html += "</dl>";
    return html;
  }
}

import CapitalizeFirstLetter from '../Helpers';
class HumanNameModel {
  constructor(name) {
    this.name = name;
  }

  getUse(capitalize=false) {
    if (capitalize) {
      return CapitalizeFirstLetter(this.name.use);
    }
    return this.name.use;
  }

  getText() {
    return this.name.text;
  }

  getFamilyName() {
    return this.name.family;
  }

  getGivenName(concatenate = false) {
    var givenNames = this.name.given;
    if (givenNames === undefined) return undefined;
    if (concatenate) {
      return givenNames.join(" ");
    }
    return givenNames;
  }

  getPrefix(concatenate = false) {
    var prefix = this.name.prefix;
    if (prefix === undefined) return undefined;
    if (concatenate) {
      return prefix.join(" ");
    }
    return prefix;
  }

  getSuffix(concatenate = false) {
    var suffix = this.name.suffix;
    if (suffix === undefined) return undefined;
    if (concatenate) {
      return suffix.join(" ");
    }
    return suffix;
  }

  getPeriod(asString = false, ifNotFound=undefined) {
    var period = this.name.period;
    if (period) {
      if (asString) {
        if (period.start && period.end) {
          return `From ${period.start} to ${period.end}`;
        } 
        if (period.start) {
          return `From ${period.start}`;
        }
        if (period.end) {
          return `To ${period.end}`;
        }
        return ifNotFound;
      } else {
        return [period.start, period.end];
      }
    }
    return ifNotFound;
  }

  getFullName() {
    var text = this.getText();
    if (text) {
      return text;
    }
    var str = '';
    var prefix = this.getPrefix(true);
    if (prefix) {
      str += prefix + ' ';
    }
    var given = this.getGivenName(true);
    if (given) {
      str += given + ' ';
    }
    var family = this.getFamilyName();
    if (family) {
      str += family + ' ';
    }
    var suffix = this.getSuffix(true);
    if (suffix) {
      str += suffix;
    }
    return str;
  }


}

export default HumanNameModel;

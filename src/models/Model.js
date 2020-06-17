export default class Model {

  _getPath(root, path) {
    if (root === undefined) {
      return undefined;
    }
    var pathSplitted = path.split(".");
    var value = root;
    var tmp;
    var value_found = true;
    for (var i = 0; i < pathSplitted.length; i++) {
        tmp = value[pathSplitted[i]];
        if (tmp === undefined) {
            value_found = false;
            break;
        }
        value = tmp;
    }
    if (value_found) {
        return value;
    } else {
        return undefined;
    }
  }

}

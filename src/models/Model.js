class Model {
  constructor(fhirClient, resource) {
    this.fhirClient = fhirClient;
    this.resource = resource;
  }

  _getPath(path) {
    return this.fhirClient.getPath(this.resource, path);
  }

}

export default Model;

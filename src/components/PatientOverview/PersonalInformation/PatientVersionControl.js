import React from "react";
import Pagination from "react-bootstrap/Pagination";
class PatientVersionControl extends React.Component {
  constructor(props) {
    super(props);
    var pages = this.getVersionPages(this.props.fhirClient.patientData.patient.versionNo, this.props.currentPatientVersion);
    this.state = {
      fhirClient: this.props.fhirClient,
      activePage: this.props.currentPatientVersion,
      pagesButtons: pages,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.currentPatientVersion !== this.props.currentPatientVersion) {
      var pages = this.getVersionPages(
        this.props.fhirClient.patientData.patient.versionNo,
        this.props.currentPatientVersion
      );
      this.setState({
        activePage: this.props.currentPatientVersion,
        pagesButtons: pages,
      });
    }
  }

  pageSelectHandle = (event) => {
    var page;
    if (event.target.dataset.page) {
      page = event.target.dataset.page;
    } else {
      // Sometimes it registers click not on button but on button label
      if (event.target.parentNode.dataset.page) {
        page = event.target.parentNode.dataset.page;
      }
    }
    if (page) {
      var newPage = this.state.fhirClient.patientData.patient.switchToVersion(
        page
      );
      this.props.parentOnVersionChangeHandle(newPage);
    }
  };

  getVersionPages(verNo, activePage) {
    var nextKey = 0;
    var pages = [];
    pages.push(
      <Pagination.First
        key={nextKey++}
        data-page={"first"}
        onClick={this.pageSelectHandle}
        disabled={activePage === 1}
      />
    
    );
    pages.push(
      <Pagination.Prev
        key={nextKey++}
        data-page={"prev"}
        onClick={this.pageSelectHandle}
        disabled={activePage === 1}
      />
    );
    var range = verNo > 5 ? [activePage - 2, activePage + 2] : [1, verNo];
    for (var i = range[0]; i <= range[1]; i++) {
      pages.push(
        <Pagination.Item
          key={nextKey++}
          data-page={i}
          onClick={this.pageSelectHandle}
          active={activePage === i}
        >
          {i}
        </Pagination.Item>
      );
    }
    pages.push(
      <Pagination.Next
        key={nextKey++}
        data-page={"next"}
        onClick={this.pageSelectHandle}
        disabled={activePage === verNo}
      />
    );
    pages.push(
      <Pagination.Last
        key={nextKey++}
        data-page={"last"}
        onClick={this.pageSelectHandle}
        disabled={activePage === verNo}
      />
    );
    return pages;
  }

  render() {
    return (
      <div className="d-flex">
        <div title="Select resource version">
          <Pagination>{this.state.pagesButtons}</Pagination>
        </div>
        <span>Last modified</span>
      </div>
    );
  }
}

export default PatientVersionControl;

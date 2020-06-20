import React from "react";
import Pagination from "react-bootstrap/Pagination";
class VersionControl extends React.Component {
  constructor(props) {
    super(props);
    var pages = this.getVersionPages(this.props.multiverModel.versionNo, this.props.currentModelVersion);
    this.state = {
      multiverModel: this.props.multiverModel,
      fhirClient: this.props.fhirClient,
      activePage: this.props.currentModelVersion,
      pagesButtons: pages,
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.currentModelVersion !== this.props.currentModelVersion) {
      var pages = this.getVersionPages(
        this.props.multiverModel.versionNo,
        this.props.currentModelVersion
      );
      this.setState({
        multiverModel: this.props.multiverModel,
        fhirClient: this.props.fhirClient,
        activePage: this.props.currentModelVersion,
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
      var newPage = this.state.multiverModel.switchToVersion(
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
    var range = verNo > 5 ? [(activePage - 2 > 1) ? activePage - 2 : 1, (activePage + 2 > verNo) ? verNo : activePage + 2] : [1, verNo];
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
        <div className="ml-auto">
          <span>Last modified </span>
          <span>{new Date(this.state.multiverModel.getCurrent().meta.lastUpdated).toLocaleString("en-US")}</span>
        </div>
      </div>
    );
  }
}

export default VersionControl;

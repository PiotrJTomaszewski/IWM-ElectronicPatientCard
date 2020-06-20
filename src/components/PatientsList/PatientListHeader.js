import React from "react";
import Navbar from "react-bootstrap/Navbar";

class PatientListHeader extends React.Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                  Electronic Patient Card
                </Navbar.Brand>
            </Navbar>
        )
    }
}

export default PatientListHeader;
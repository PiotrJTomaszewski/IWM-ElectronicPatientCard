import React from 'react';


class DebugArea extends React.Component {

    render() {
        console.log(this.props.patient.resource);
        return (
            <textarea value={this.props.patient.resource.telecom} readOnly={true}></textarea>
        )
    }
}

export default DebugArea;
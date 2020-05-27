import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function Loading() {
  return (
    <div className="text-center">
      <h1 className="display-1 mt-5">Please wait, fetching data</h1>
      <Spinner animation="border" />
    </div>
  );
}

export default Loading;

import React, { Component } from 'react';

import { RouteComponentProps } from "@reach/router";

class NotFound extends Component<RouteComponentProps> {
  render() {
    return (
      <div>
        <h1>icecreme.brulee cannot find the page you are looking for :(</h1>
      </div>
    )
  }
}

export default NotFound;
import React, { Component } from 'react';
import {api} from './api';

class Actions extends Component {

  render() {
    if (!this.props.isAdmin) {
      return (
        <div>
          <p>
            <button type="button" className="btn btn-success" onClick={api.public().like}>Like</button> &nbsp;
            <button type="button" className="btn btn-warning" onClick={api.public().dislike}>Dislike</button> &nbsp;
          </p>
          <p>
            <button type="button" className="btn btn-sm btn-secondary" onClick={this.props.loginCallback}>Login</button>
          </p>
        </div>
      );
    } else {
      if (this.props.status === "stopped") {
        return (
          <p>
            <button type="button" className="btn btn-primary" onClick={api.private(this.props.apiKey).start}>Start</button>
          </p>
        );
      } else if (this.props.status === "running") {
        return (
          <p>
            <button type="button" className="btn btn-primary" onClick={api.private(this.props.apiKey).pause}>Pause</button> &nbsp;
            <button type="button" className="btn btn-primary" onClick={api.private(this.props.apiKey).stop}>Stop</button>
          </p>
        );
      } else if (this.props.status === "paused") {
        return (
          <p>
            <button type="button" className="btn btn-primary" onClick={api.private(this.props.apiKey).resume}>Resume</button> &nbsp;
            <button type="button" className="btn btn-primary" onClick={api.private(this.props.apiKey).stop}>Stop</button>
          </p>
        );
      } else {
        return (
          <p>
            ...
          </p>
        );
      }
    }

  }
}

export default Actions;

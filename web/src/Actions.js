import React, { Component } from 'react';
import {api} from './api';

class Actions extends Component {

  render() {
    if (!this.props.isAdmin) {
      return (
        <p>
          <button type="button" className="btn btn-primary" onClick={api.public.like}>Like</button> &nbsp;
          <button type="button" className="btn btn-primary" onClick={api.public.dislike}>Dislike</button> &nbsp;
          <button type="button" className="btn btn-primary" onClick={this.props.loginCallback}>Login</button>
        </p>
      );
    } else {
      if (this.props.status == "stopped") {
        return (
          <p>
            <button type="button" className="btn btn-primary" onClick={api.private(this.props.apiKey).start}>Start</button>
          </p>
        );
      } else if (this.props.status == "running") {
        return (
          <p>
            <button type="button" className="btn btn-primary" onClick={this._pause.bind(this)}>Pause</button> &nbsp;
            <button type="button" className="btn btn-primary" onClick={this._stop.bind(this)}>Stop</button>
          </p>
        );
      } else if (this.props.status == "paused") {
        return (
          <p>
            <button type="button" className="btn btn-primary" onClick={this._resume.bind(this)}>Resume</button> &nbsp;
            <button type="button" className="btn btn-primary" onClick={this._stop.bind(this)}>Stop</button>
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

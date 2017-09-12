import React, { Component } from 'react';

class Actions extends Component {

  _like() {
      fetch("http://localhost:8080/like", {method: "POST"})
        .then(function() { console.log("Like sent!"); });
  }

  _dislike() {
      fetch("http://localhost:8080/dislike", {method: "POST"})
        .then(function() { console.log("Dislike sent!"); });
  }

  _start() {
      var name = prompt("Presentation name?");
      fetch("http://localhost:8080/start", { method: "POST", headers: {Authentication: this.props.apiKey}})
        .then(function() { console.log("Start sent!"); });
  }

  _stop() {
      fetch("http://localhost:8080/stop", {method: "POST", headers: {Authentication: this.props.apiKey}})
        .then(function() { console.log("Stop sent!"); });
  }

  _pause() {
      fetch("http://localhost:8080/pause", {method: "POST", headers: {Authentication: this.props.apiKey}})
        .then(function() { console.log("Pause sent!"); });
  }

  _resume() {
      fetch("http://localhost:8080/resume", {method: "POST", headers: {Authentication: this.props.apiKey}})
        .then(function() { console.log("Resume sent!"); });
  }

  render() {
    if (!this.props.isAdmin) {
      return (
        <p>
          <button type="button" className="btn btn-primary" onClick={this._like}>Like</button> &nbsp;
          <button type="button" className="btn btn-primary" onClick={this._dislike}>Dislike</button> &nbsp;
          <button type="button" className="btn btn-primary" onClick={this.props.loginCallback}>Login</button>
        </p>
      );
    } else {
      if (this.props.status == "stopped") {
        return (
          <p>
            <button type="button" className="btn btn-primary" onClick={this._start.bind(this)}>Start</button>
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

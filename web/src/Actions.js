import React, { Component } from 'react';

class Actions extends Component {

  _reset() {
      fetch("http://localhost:8080/reset", {method: "POST"})
        .then(function() { console.log("Reset sent!"); });
  }

  _like() {
      fetch("http://localhost:8080/like", {method: "POST"})
        .then(function() { console.log("Like sent!"); });
  }

  _dislike() {
      fetch("http://localhost:8080/dislike", {method: "POST"})
        .then(function() { console.log("Dislike sent!"); });
  }

  render() {
    return (
      <p>
        <button type="button" className="btn" onClick={this._like}>Like</button> &nbsp;
        <button type="button" className="btn" onClick={this._dislike}>Dislike</button> &nbsp;
        <button type="button" className="btn" onClick={this._reset}>Reset</button>
      </p>
    );
  }
}

export default Actions;

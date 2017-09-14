import React, { Component } from 'react';
import './Counter.css';

class Counter extends Component {

  render() {
    if (typeof this.props.remaining === "undefined") return <p>Loading...</p>
    var remaining = this.props.remaining >= 0 ? this.props.remaining : 0;
    var minutes = Math.floor(remaining / 60)
    var seconds = remaining - minutes * 60
    if (seconds < 10) seconds = "0" + seconds
    return (
      <h1 className="Counter">0{minutes}m:{seconds}s</h1>
    );
  }
}

export default Counter;

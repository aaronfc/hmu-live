import React, { Component } from 'react';
import './App.css';
import Counter from './Counter.js'
import Actions from './Actions.js'
import Hearts from './Hearts.js'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      mostRecentData: {
        likes: 0,
        dislikes: 0,
        remaining: undefined,
        tick: Date.now()
      }
    };
    this.hearts = undefined;
  }

  componentDidMount() { // Best place to make NW requests
      this._timer = setInterval(this._loadData.bind(this), 1000);
  }

  _loadData() {
    fetch("http://localhost:8080/events/" + this.state.mostRecentData.tick)
      .then(d => d.json())
      .then(d => {
        this.setState({
          mostRecentData: d
        })
        if (d.likes > 0) { this.hearts._draw(d.likes); }
      })
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <h2><i className="fa fa-circle text-danger Blink"></i> HMU Live</h2>
        </div>
        <p className="App-intro">
          <Counter remaining={this.state.mostRecentData.remaining}/>
        </p>
        <p>
          <Hearts ref={instance => {this.hearts = instance;}}/>
        </p>
        <p>
          Likes: {this.state.mostRecentData.likes} | Dislikes: {this.state.mostRecentData.dislikes}
        </p>
        <p>
          <Actions/>
        </p>
      </div>
    );
  }
}

export default App;

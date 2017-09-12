import React, { Component } from 'react';
import './App.css';
import Counter from './Counter.js'
import Actions from './Actions.js'
import Hearts from './Hearts.js'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      apiKey: null,
      isAdmin: false,
      //apiKey: 'def0734f12ed2dad8ff26bfb8967569815f40c31',
      //isAdmin: true,
      lastUpdate: {
        status: "unknown",
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
    fetch("http://localhost:8080/updates/" + this.state.lastUpdate.tick)
      .then(d => d.json())
      .then(d => {
        this.setState({lastUpdate: d})
        if (d.likes > 0) { this.hearts._draw(d.likes); }
      })
  }

  _login() {
      var password = prompt("Password?");
      if (password) {
        fetch("http://localhost:8080/login", {method: "POST", body: JSON.stringify({username: 'admin', password: password})})
        .then(function(res){ if (!res.ok) { throw Error(res.statusText) } return res.json(); })
        .then(function(data) { this.state.apiKey = data.apiKey; this.state.isAdmin = true; }.bind(this))
        .catch(function(error) { alert('Wrong login information.'); console.log(error); });
      }
  }


  render() {

    return (
      <div className="App">
        <div className="App-header">
          <h2><i className="fa fa-circle text-danger Blink"></i> HMU Live</h2>
        </div>
        <p className="App-intro">
          <Counter remaining={this.state.lastUpdate.remaining}/>
        </p>
        <p>
          <Hearts ref={instance => {this.hearts = instance}}/>
        </p>
        <p>
          Likes: {this.state.lastUpdate.likes} | Dislikes: {this.state.lastUpdate.dislikes}
        </p>
        <p>
          <Actions status={this.state.lastUpdate.status} isAdmin={this.state.isAdmin} loginCallback={this._login.bind(this)} apiKey={this.state.apiKey}/>
        </p>
      </div>
    );
  }
}

export default App;

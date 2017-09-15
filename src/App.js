import React, { Component } from 'react';
import './App.css';
import Counter from './Counter.js'
import Actions from './Actions.js'
import Results from './Results.js'
import Hearts from './Hearts.js'
import Poops from './Poops.js'
import { API_ENDPOINT } from './config';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      apiKey: null,
      isAdmin: false,
      lastUpdate: {
        status: "unknown",
        likes: 0,
        dislikes: 0,
        remaining: undefined,
        tick: Date.now()
      }
    };
    this.hearts = undefined;
    this.poops = undefined;
  }

  componentDidMount() { // Best place to make NW requests
      this._timer = setInterval(this._loadData.bind(this), 1000);
  }

  _loadData() {
    fetch(API_ENDPOINT + "/updates/" + this.state.lastUpdate.tick)
      .then(d => d.json())
      .then(d => {
        this.setState({lastUpdate: d})
        if (d.likes > 0) { this.hearts._draw(d.likes); }
        if (d.dislikes > 0) { this.poops._draw(d.dislikes); }
      })
  }

  _login() {
      var password = prompt("Password?");
      if (password) {
        fetch(API_ENDPOINT + "/login", {method: "POST", body: JSON.stringify({username: 'admin', password: password})})
        .then(function(res){ if (!res.ok) { throw Error(res.statusText) } return res.json(); })
        .then(function(data) {
          this.setState({apiKey: data.apiKey, isAdmin: true});
        }.bind(this))
        .catch(function(error) { alert('Wrong login information.'); console.log(error); });
      }
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <h2><i className="fa fa-circle text-danger Blink"></i> HMU Live</h2>
        </div>
        <div className="App-intro">
          <Counter remaining={this.state.lastUpdate.remaining}/>
        </div>
        <div>
          <Hearts ref={instance => {this.hearts = instance}}/>
          <Poops ref={instance => {this.poops = instance}}/>
        </div>
        <div className="actions">
          <Actions status={this.state.lastUpdate.status} isAdmin={this.state.isAdmin} loginCallback={this._login.bind(this)} apiKey={this.state.apiKey}/>
        </div>
        <div className="actions">
          <Results isAdmin={this.state.isAdmin} apiKey={this.state.apiKey}/>
        </div>
      </div>
    );
  }
}

export default App;

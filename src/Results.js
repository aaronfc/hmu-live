import React, { Component } from 'react';
import {api} from './api';

function ListItem(props) {
  return (
    <tr>
      <td>{props.value.end_time}</td>
      <td>{props.value.likes}</td>
      <td>{props.value.dislikes}</td>
    </tr>
  )
}

function NumberList(props) {
  const results = props.results;
  const listItems = results.map((result) =>
    <ListItem key={result.id} value={result} />
  );
  return (
    <table className="table">
      <thead>
        <tr>
          <th>End time</th>
          <th>Likes</th>
          <th>Dislikes</th>
        </tr>
      </thead>
      <tbody>
        {listItems}
      </tbody>
    </table>
  );
}

class Results extends Component {

  constructor(props) {
    super(props);
    this.loadResults = this.loadResults.bind(this);
    this.state = {results: []};
  }

  loadResults() {
    console.log("Load results!");
    api.private(this.props.apiKey).results(this.loadResultsCallback.bind(this));
  }

  loadResultsCallback(data) {
    console.log("Load results end!");
    this.setState({results: data});
  }

  componentDidMount() {
    this.loadResults();
  }

  render() {
    if (!this.props.isAdmin) {
      return null;
    }
    return (
      <div>
        <div>
          <button type="button" className="btn btn-secondary" onClick={this.loadResults}>Refresh results</button>
        </div>
        <div className="container mt-3">
          <NumberList results={this.state.results} />
        </div>
      </div>
    )
  }
}

export default Results;

import React from 'react';
import { subscribeToTimer } from './api';

import './index.css';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {timestamp: 'no timestamp yet'};

		subscribeToTimer((err, timestamp) => this.setState({ 
			timestamp 
		}));
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">{this.state.timestamp}</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
			</div>
		);
	}
}

export default App;

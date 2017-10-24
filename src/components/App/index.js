import React from 'react';
import { subscribeToTimer, sendMessage, subscribeToMessages } from './api';

import './index.css';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			timestamp: 'no timestamp yet',
			messageValue: '',
			strings: ["test string"]
		};

		subscribeToTimer((err, timestamp) => this.setState({ 
			timestamp 
		}));

		subscribeToMessages((err, message) => {
			console.log("message callback");
			let newStrings = this.state.strings;
			newStrings.push(message);
			this.setState({
				messageValue: '',
				strings: newStrings
			});
		});

		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	renderStrings() {
		let strings = [];

		this.state.strings.forEach((string, index) => {
			strings.push(
				<div key={index}>{string}</div>
			)
		});

		return strings;
	}

	handleChange(event) {
    	this.setState({messageValue: event.target.value});
  	}

  	handleSubmit(event) {
		console.log('Submitted: ' + this.state.messageValue);
		event.preventDefault();

		sendMessage(this.state.messageValue);

	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">{this.state.timestamp}</h1>
					<input type="text" placeholder="placeholder" value={this.state.messageValue} onChange={this.handleChange}/>
					<button onClick={this.handleSubmit}>Submit</button>
				</header>
				<div className="App-intro">
					{this.renderStrings()}
				</div>
			</div>
		);
	}
}

export default App;

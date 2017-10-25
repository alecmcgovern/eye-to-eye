import React from 'react';
import { sendMessage, subscribeToShowImage, toggleShowImage, clearCanvas } from './api';
import Canvas from './canvas.js';
import './index.css';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			messageValue: '',
			string: "",
			showImage: false
		};

		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);

    	subscribeToShowImage((err, showImage) => {
			this.setState({
				showImage: showImage
			});
		});
	}

	handleChange(event) {
    	this.setState({messageValue: event.target.value});
  	}

  	handleSubmit(event) {
		event.preventDefault();

		sendMessage(this.state.messageValue);
		this.setState({messageValue: ""});
	}

	toggleShowImage() {
		toggleShowImage(!this.state.showImage);
	}

	clearCanvas() {
		clearCanvas();
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<div className="text-controls-container">
						<input type="text" placeholder="placeholder" value={this.state.messageValue} onChange={this.handleChange}/>
						<button onClick={this.handleSubmit}>Submit</button>
					</div>
					<div className="image-controls-container">
						<button onClick={() => this.toggleShowImage()}>toggle image</button>
					</div>
					<div className="canvas-controls-container">
						<button onClick={() => this.clearCanvas()}>Clear</button>
					</div>

				</header>
				<Canvas />
			</div>
		);
	}
}

export default App;

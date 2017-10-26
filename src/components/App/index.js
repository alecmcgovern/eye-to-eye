import React from 'react';
import { sendMessage, subscribeToShowImage, toggleShowImage, clearCanvas, changeImageUrl, setBackgroundColor } from './api';
import Canvas from './canvas.js';
import './index.css';


import datapoints from '../../images/datapoints.jpg';
import memorand from '../../images/memorand.png';
import monitor from '../../images/monitor.jpg';
import wytches from '../../images/wytches.png';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			messageValue: '',
			string: "",
			showImage: false,
			imageUrl: datapoints
		};

		this.images = [datapoints, memorand, monitor, wytches];

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
		changeImageUrl(this.state.imageUrl);
		toggleShowImage(!this.state.showImage);
	}

	clearCanvas() {
		clearCanvas();
	}

	renderImages() {
		let imageElements = [];
		const currentUrl = this.state.imageUrl;

		this.images.forEach((image, index) => {
			let imageSelectorClass = "image-selector";
			if (currentUrl === image) {
				imageSelectorClass += " image-selected";
			}
			imageElements.push(<img key={index} className={imageSelectorClass} onClick={() => this.selectImageUrl(image)} src={image} alt="" />)
		});

		return imageElements;
	}

	selectImageUrl(imageUrl) {
		this.setState({ imageUrl: imageUrl });
		changeImageUrl(imageUrl);
	}

	setBackgroundColor(color) {
		setBackgroundColor(color);
	}

	render() {
		let toggleImageButtonClass = "toggle-image-button";

		if (this.state.showImage) {
			toggleImageButtonClass += " image-button-selected";
		}

		return (
			<div className="App">
				<header className="App-header">
					<div className="image-controls-container">
						<div className="image-selector-container">{this.renderImages()}</div>
						<div className={toggleImageButtonClass} onClick={() => this.toggleShowImage()}>Show/Hide</div>
					</div>
					<div className="background-controls-container">
						<div className="color-control background-color-1" onClick={() => this.setBackgroundColor("black")}></div>
						<div className="color-control background-color-2" onClick={() => this.setBackgroundColor("white")}></div>
						<div className="color-control background-color-3" onClick={() => this.setBackgroundColor("blue")}></div>
						<div className="color-control background-color-4" onClick={() => this.setBackgroundColor("orange")}></div>
					</div>
					<div className="text-controls-container">
						<input type="text" placeholder="placeholder" value={this.state.messageValue} onChange={this.handleChange}/>
						<button onClick={this.handleSubmit}>Submit</button>
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

import React from 'react';
import { subscribeToMessages, sendSketch, subscribeToSketches, subscribeToShowImage, subscribeToClearCanvas, subscribeToChangeImageUrl, subscribeToSetBackgroundColor, clearCanvas } from './api';

import './canvas.css';
import './colorControls.css';

const canvasWidth = 1000;
const canvasHeight = 600;

class Canvas extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			time: new Date(),
			string: "",
			showImage: false,
			imageUrl: "",
			backgroundColor: "black"
		};

		this.canvas = false;
		this.ctx = false;
		this.prevX = 0;
		this.currX = 0;
		this.prevY = 0;
		this.currY = 0;

		this.color = "white";
		this.flag = false;
		this.dotFlag = false;
		this.lineWidth = 2;

		this.sketch = {
			color: this.color,
			points: [],
			width: 0
		};

		setInterval(() => {
			this.setState({time: new Date()})
		}, 100);

		subscribeToMessages((err, message) => {
			this.setState({
				string: message
			});
		});

		subscribeToShowImage((err, showImage) => {
			this.setState({
				showImage: showImage
			});
		});

		subscribeToChangeImageUrl((err, imageUrl) => {
			this.setState({
				imageUrl: imageUrl
			});
		});

		subscribeToSetBackgroundColor((err, color) => {
			this.setState({
				backgroundColor: color
			});
		});

		subscribeToClearCanvas((err, message) => {
			this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
		});

		subscribeToSketches((err, sketch) => this.drawSketch(sketch));
	}

	drawSketch(sketch) {
		for (let i = 0; i < sketch.points.length; i++) {
			if (i === 0) {
				this.ctx.fillRect(sketch.points[0].x, sketch.points[0].y, 2, 2);
			} else {
				let curX = sketch.points[i].x;
				let curY = sketch.points[i].y;
				let preX = sketch.points[i-1].x;
				let preY = sketch.points[i-1].y;

				this.drawFromServer(sketch.color, sketch.width, curX, curY, preX, preY);
			}
		}
	}

	drawFromServer(color, width, curX, curY, preX, preY) {
		this.ctx.beginPath();
		this.ctx.moveTo(preX, preY);
		this.ctx.lineTo(curX, curY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
        this.ctx.closePath();
	}
	

	componentDidMount() {
		if (this.props.showControls) {
			this.onChange();
			this.selectColor(this.color);
		}

		this.canvas = this.refs.canvas;
		this.ctx = this.refs.canvas.getContext("2d");
		this.findxy("",{});

		this.canvas.addEventListener("mousedown", (e) => this.findxy(e, "down"));
		this.canvas.addEventListener("touchstart", (e) => this.findxy(e, "touchstart"));

		this.canvas.addEventListener("mouseup", (e) => this.findxy(e, "up"));
		this.canvas.addEventListener("touchend", (e) => this.findxy(e, "up"));

		this.canvas.addEventListener("mousemove", (e) => this.findxy(e, "move"));
		this.canvas.addEventListener("touchmove", (e) => this.findxy(e, "touchmove"));

		this.canvas.addEventListener("mouseout", (e) => this.findxy(e, "out"));
		this.canvas.addEventListener("touchleave", (e) => this.findxy(e, "out"));
	}

	componentDidUpdate() {
		this.refs.backgroundColor.style.backgroundColor = this.state.backgroundColor;

		if (this.state.backgroundColor === "white" || this.state.backgroundColor === "yellow") {
			this.refs.timer.style.color = "black";
		} else {
			this.refs.timer.style.color = "white";
		}
	}

	draw(color, width) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.prevX, this.prevY);
		this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
        this.ctx.closePath();
	}
	
	findxy(e, type) {
		if (!this.props.showControls) {
			return;
		}

		if (e.touches && e.touches.length < 2 && e.preventDefault) {
			e.preventDefault();
		}

		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

		if (type === 'down') {
			this.prevX = this.currX;
			this.currX = e.clientX - this.canvas.parentElement.offsetLeft - this.canvas.offsetLeft + scrollLeft;

			this.prevY = this.currY;
			this.currY = e.clientY - this.canvas.parentElement.offsetTop - this.canvas.offsetTop + scrollTop;

			this.flag = true;
			this.dotFlag = true;

			this.sketch.points.push({ x: this.currX, y: this.currY });

			if (this.dotFlag) {
				this.ctx.beginPath();
				this.ctx.fillStyle = this.color;
				this.ctx.lineWidth = this.refs.slider.value;
				this.ctx.fillRect(this.currX, this.currY, this.lineWidth, this.lineWidth);
				this.ctx.closePath();
				this.dotFlag = false;
			}
		}

		if (type === 'touchstart' && e.touches.length < 2) {
			this.prevX = this.currX;
			this.currX = e.touches[0].clientX - this.canvas.parentElement.offsetLeft - this.canvas.offsetLeft + scrollLeft;

			this.prevY = this.currY;
			this.currY = e.touches[0].clientY - this.canvas.parentElement.offsetTop - this.canvas.offsetTop + scrollTop;

			this.flag = true;
			this.dotFlag = true;

			this.sketch.points.push({ x: this.currX, y: this.currY });

			if (this.dotFlag) {
				this.ctx.beginPath();
				this.ctx.fillStyle = this.color;
				this.ctx.lineWidth = this.refs.slider.value;
				this.ctx.fillRect(this.currX, this.currY, this.lineWidth, this.lineWidth);
				this.ctx.closePath();
				this.dotFlag = false;
			}
		}

		if (type === 'up' || type === 'out') {
			this.flag = false;
			if (this.sketch && this.sketch.points.length > 0) {
				sendSketch(this.sketch);
			}
			this.sketch = {
				color: this.color,
				points: [],
				width: this.refs.slider.value
			};
		}

		if (type === 'move') {
			if (this.flag) {
				this.prevX = this.currX;
				this.currX = e.clientX - this.canvas.parentElement.offsetLeft - this.canvas.offsetLeft + scrollLeft;

				this.prevY = this.currY;
				this.currY = e.clientY - this.canvas.parentElement.offsetTop - this.canvas.offsetTop + scrollTop;

				this.sketch.points.push({ x: this.currX, y: this.currY });
				this.draw(this.color, this.refs.slider.value);
			}
		}

		if (type === 'touchmove' && e.touches.length < 2) {
			if (this.flag) {
				this.prevX = this.currX;
				this.currX = e.touches[0].clientX - this.canvas.parentElement.offsetLeft - this.canvas.offsetLeft + scrollLeft;

				this.prevY = this.currY;
				this.currY = e.touches[0].clientY - this.canvas.parentElement.offsetTop - this.canvas.offsetTop + scrollTop;

				this.sketch.points.push({ x: this.currX, y: this.currY });
				this.draw(this.color, this.refs.slider.value);
			}
		}
	}

	selectColor(color) {
		this.color = color;
		this.sketch.color = color;
		this.refs.widthIndicator.style.backgroundColor = color;
	}

	onChange() {
		this.refs.widthIndicator.style.width = this.refs.slider.value + "px";
		this.refs.widthIndicator.style.height = this.refs.slider.value + "px";

		this.sketch.width = this.refs.slider.value;
	}

	renderSketchControls() {
		if (this.props.showControls) {
			return <div className="sketch-controls">
					<div ref="colorControls" className="color-controls-container">
						<div className="color-control color-1" onClick={() => this.selectColor("white")}></div>
						<div className="color-control color-2" onClick={() => this.selectColor("black")}></div>
						<div className="color-control color-3" onClick={() => this.selectColor("red")}></div>
						<div className="color-control color-4" onClick={() => this.selectColor("orange")}></div>
						<div className="color-control color-5" onClick={() => this.selectColor("yellow")}></div>
						<div className="color-control color-6" onClick={() => this.selectColor("green")}></div>
						<div className="color-control color-7" onClick={() => this.selectColor("blue")}></div>
						<div className="color-control color-8" onClick={() => this.selectColor("purple")}></div>
					</div>
					<div className="slider-container">
						<input ref="slider" type="range" className="width-slider" onChange={() => this.onChange()} min={1} max={40} defaultValue={2}/>
						<div ref="widthIndicator" className="width-indicator"></div>
					</div>
				</div>;
		} else {
			return null;
		}
	}


	render() {
		let canvasBackgroundImageClass = "canvas-background-image";

		if (!this.state.showImage) {
			canvasBackgroundImageClass += " image-hide";
		}

		const fiveMin = 1* 20 * 1000;
		let timeUntilClear = ((fiveMin - (this.state.time % fiveMin)) / 1000).toFixed(0);
		if (timeUntilClear < 1) {
			// if (!this.props.showControls) {
			// 	console.log("screenshot");
			// 	let image = this.refs.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");	
			// 	window.location.href=image;
			// }
			clearCanvas();
		}

		return (
			<div className="canvas-container">
				<div ref="backgroundColor" className="canvas-backdrop"></div>
				<img className={canvasBackgroundImageClass} src={this.state.imageUrl} alt=""/>
				<div className="string-container">
					<p className="string-text">{this.state.string}</p>
				</div>
				<canvas width={canvasWidth + "px"} height={canvasHeight + "px"} ref="canvas" id="canvas"></canvas>
				{this.renderSketchControls()}
				<div ref="timer" className="timer">Clearing in {timeUntilClear} sec</div>
			</div>
		);
	}
}

export default Canvas;
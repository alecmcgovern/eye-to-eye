import React from 'react';
import { subscribeToMessages, sendSketch, subscribeToSketches, subscribeToShowImage, subscribeToClearCanvas } from './api';


import './canvas.css';
import datapoints from '../../images/datapoints.jpg';

const canvasWidth = 1000;
const canvasHeight = 600;

class Canvas extends React.Component {
	constructor(props) {
		super(props);

		this.state = { 
			string: "",
			showImage: false
		};

		this.canvas = false;
		this.ctx = false;
		this.prevX = 0;
		this.currX = 0;
		this.prevY = 0;
		this.currY = 0;

		this.style = "black";
		this.flag = false;
		this.dotFlag = false;
		this.lineWidth = 2;

		this.sketch = [];

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

		subscribeToClearCanvas((err, message) => {
			this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
		});

		subscribeToSketches((err, sketch) => this.drawSketch(sketch));
	}

	drawSketch(sketch) {
		for (let i = 0; i < sketch.length; i++) {
			if (i === 0) {
				this.ctx.fillRect(sketch[0].x, sketch[0].y, 2, 2);
			} else {
				this.currX = sketch[i].x;
				this.currY = sketch[i].y;
				this.prevX = sketch[i-1].x;
				this.prevY = sketch[i-1].y;

				this.draw();
			}
		}
	}
	

	componentDidMount() {
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

	draw() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.prevX, this.prevY);
		this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = this.style;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        this.ctx.closePath();
	}
	
	findxy(e, type) {
		if (e.touches && e.touches.length < 2 && e.preventDefault) {
			e.preventDefault();
		}

		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

		if (type === 'down') {
			this.prevX = this.currX;
			this.currX = e.clientX - this.canvas.offsetLeft + scrollLeft;

			this.prevY = this.currY;
			this.currY = e.clientY - this.canvas.offsetTop + scrollTop;

			this.flag = true;
			this.dotFlag = true;

			this.sketch.push({ x: this.currX, y: this.currY });

			if (this.dotFlag) {
				this.ctx.beginPath();
				this.ctx.fillStyle = this.style;
				this.ctx.fillRect(this.currX, this.currY, this.lineWidth, this.lineWidth);
				this.ctx.closePath();
				this.dotFlag = false;
			}
		}

		if (type === 'touchstart' && e.touches.length < 2) {
			this.prevX = this.currX;
			this.currX = e.touches[0].clientX - this.canvas.offsetLeft + scrollLeft;

			this.prevY = this.currY;
			this.currY = e.touches[0].clientY - this.canvas.offsetTop + scrollTop;

			this.flag = true;
			this.dotFlag = true;

			this.sketch.push({ x: this.currX, y: this.currY });

			if (this.dotFlag) {
				this.ctx.beginPath();
				this.ctx.fillStyle = this.style;
				this.ctx.fillRect(this.currX, this.currY, this.lineWidth, this.lineWidth);
				this.ctx.closePath();
				this.dotFlag = false;
			}
		}

		if (type === 'up' || type === 'out') {
			this.flag = false;

			sendSketch(this.sketch);
			this.sketch = [];
		}

		if (type === 'move') {
			if (this.flag) {
				this.prevX = this.currX;
				this.currX = e.clientX - this.canvas.offsetLeft + scrollLeft;

				this.prevY = this.currY;
				this.currY = e.clientY - this.canvas.offsetTop + scrollTop;

				this.sketch.push({ x: this.currX, y: this.currY });
				this.draw();
			}
		}

		if (type === 'touchmove' && e.touches.length < 2) {
			if (this.flag) {
				this.prevX = this.currX;
				this.currX = e.touches[0].clientX - this.canvas.offsetLeft + scrollLeft;

				this.prevY = this.currY;
				this.currY = e.touches[0].clientY - this.canvas.offsetTop + scrollTop;

				this.sketch.push({ x: this.currX, y: this.currY });
				this.draw();
			}
		}
	}


	render() {
		let canvasBackgroundImageClass = "canvas-background-image";

		if (!this.state.showImage) {
			canvasBackgroundImageClass += " image-hide";
		}

		return (
			<div className="canvas-container">
				<img className={canvasBackgroundImageClass} src={datapoints} alt=""/>
				<div className="string-container">
					{this.state.string}
				</div>
				<canvas width={canvasWidth + "px"} height={canvasHeight + "px"} ref="canvas" id="canvas"></canvas>
			</div>
		);
	}
}

export default Canvas;
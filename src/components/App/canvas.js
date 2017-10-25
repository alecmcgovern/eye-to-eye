import React from 'react';
import { subscribeToMessages, sendSketch, subscribeToSketches, subscribeToShowImage, subscribeToClearCanvas } from './api';

import './canvas.css';
import './colorControls.css';
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

		this.color = "black";
		this.flag = false;
		this.dotFlag = false;
		this.lineWidth = 2;

		this.sketch = {
			color: this.color,
			points: []
		};

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
		for (let i = 0; i < sketch.points.length; i++) {
			if (i === 0) {
				this.ctx.fillRect(sketch.points[0].x, sketch.points[0].y, 2, 2);
			} else {
				this.currX = sketch.points[i].x;
				this.currY = sketch.points[i].y;
				this.prevX = sketch.points[i-1].x;
				this.prevY = sketch.points[i-1].y;

				this.draw(sketch.color);
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

	draw(color) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.prevX, this.prevY);
		this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = color;
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
			this.currX = e.clientX - this.canvas.parentElement.offsetLeft - this.canvas.offsetLeft + scrollLeft;

			this.prevY = this.currY;
			this.currY = e.clientY - this.canvas.parentElement.offsetTop - this.canvas.offsetTop + scrollTop;

			this.flag = true;
			this.dotFlag = true;

			this.sketch.points.push({ x: this.currX, y: this.currY });

			if (this.dotFlag) {
				this.ctx.beginPath();
				this.ctx.fillStyle = this.color;
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
				points: []
			};
		}

		if (type === 'move') {
			if (this.flag) {
				this.prevX = this.currX;
				this.currX = e.clientX - this.canvas.parentElement.offsetLeft - this.canvas.offsetLeft + scrollLeft;

				this.prevY = this.currY;
				this.currY = e.clientY - this.canvas.parentElement.offsetTop - this.canvas.offsetTop + scrollTop;

				this.sketch.points.push({ x: this.currX, y: this.currY });
				this.draw(this.color);
			}
		}

		if (type === 'touchmove' && e.touches.length < 2) {
			if (this.flag) {
				this.prevX = this.currX;
				this.currX = e.touches[0].clientX - this.canvas.parentElement.offsetLeft - this.canvas.offsetLeft + scrollLeft;

				this.prevY = this.currY;
				this.currY = e.touches[0].clientY - this.canvas.parentElement.offsetTop - this.canvas.offsetTop + scrollTop;

				this.sketch.points.push({ x: this.currX, y: this.currY });
				this.draw(this.color);
			}
		}
	}

	selectColor(color) {
		this.color = color;
		this.sketch.color = color;
	}


	render() {
		let canvasBackgroundImageClass = "canvas-background-image";

		if (!this.state.showImage) {
			canvasBackgroundImageClass += " image-hide";
		}

		let color1Class = "color-control color-1";
		let color2Class = "color-control color-2";
		let color3Class = "color-control color-3";
		let color4Class = "color-control color-4";
		let color5Class = "color-control color-5";
		let color6Class = "color-control color-6";
		let color7Class = "color-control color-7";
		let color8Class = "color-control color-8";

		return (
			<div className="canvas-container">
				<img className={canvasBackgroundImageClass} src={datapoints} alt=""/>
				<div className="string-container">
					{this.state.string}
				</div>
				<canvas width={canvasWidth + "px"} height={canvasHeight + "px"} ref="canvas" id="canvas"></canvas>
				<div className="color-controls-container">
					<div className={color1Class} onClick={() => this.selectColor("black")}></div>
					<div className={color2Class} onClick={() => this.selectColor("white")}></div>
					<div className={color3Class} onClick={() => this.selectColor("red")}></div>
					<div className={color4Class} onClick={() => this.selectColor("orange")}></div>
					<div className={color5Class} onClick={() => this.selectColor("yellow")}></div>
					<div className={color6Class} onClick={() => this.selectColor("green")}></div>
					<div className={color7Class} onClick={() => this.selectColor("blue")}></div>
					<div className={color8Class} onClick={() => this.selectColor("purple")}></div>
				</div>
			</div>
		);
	}
}

export default Canvas;
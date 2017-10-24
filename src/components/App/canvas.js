import React from 'react';
import { sendSketch, subscribeToSketches } from './api';


import './canvas.css';

class Canvas extends React.Component {
	constructor(props) {
		super(props);

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

		subscribeToSketches((err, sketch) => this.drawSketch(sketch));
	}

	drawSketch(sketch) {
		
		console.log("sketch callback");
		if (sketch.length > 0) {
		}

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

		this.canvas.addEventListener("mousedown", (event) => this.findxy("down", event));
		this.canvas.addEventListener("touchstart", (event) => this.findxy("down", event));

		this.canvas.addEventListener("mouseup", (event) => this.findxy("up", event));
		this.canvas.addEventListener("touchend", (event) => this.findxy("up", event));

		this.canvas.addEventListener("mousemove", (event) => this.findxy("move", event));
		this.canvas.addEventListener("touchmove", (event) => this.findxy("move", event));

		this.canvas.addEventListener("mouseout", (event) => this.findxy("out", event));
		this.canvas.addEventListener("touchleave", (event) => this.findxy("out", event));
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
	
	findxy(type, event) {
		if (type === 'down') {
			console.log('down');
			this.prevX = this.currX;
			this.currX = event.clientX - this.canvas.offsetLeft;

			this.prevY = this.currY;
			this.currY = event.clientY - this.canvas.offsetTop;

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
				this.currX = event.clientX - this.canvas.offsetLeft;

				this.prevY = this.currY;
				this.currY = event.clientY - this.canvas.offsetTop;

				this.sketch.push({ x: this.currX, y: this.currY });
				this.draw();
			}
		}
	}


	render() {
		return (
			<canvas width="600px" height="400px" ref="canvas" id="canvas">

			</canvas>
		);
	}
}

export default Canvas;
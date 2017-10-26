import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './components/App';
import Canvas from './components/App/canvas.js';
import NotFound from './components/NotFound';

import './index.css';

const CanvasShowControls = (props) => {
	return (
		<Canvas showControls={true}/>
	);
}

const CanvasHideControls = (props) => {
	return (
		<Canvas showControls={false}/>
	);
}

const AppShowControls = (props) => {
	return (
		<App showControls={true}/>
	);
}

ReactDOM.render(
	<Router>
		<Switch>
			<Route exact path="/" component={CanvasShowControls} />
			<Route exact path="/display" component={CanvasHideControls} />
			<Route exact path="/admin" component={AppShowControls} />
			<Route path="*" component={NotFound} />
		</Switch>
	</Router>,
	document.getElementById('root')
);

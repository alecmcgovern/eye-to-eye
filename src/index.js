import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './components/App';
import NotFound from './components/NotFound';

import './index.css';

ReactDOM.render(
	<Router>
		<Switch>
			<Route exact path="/" component={App} />
			<Route path="*" component={NotFound} />
		</Switch>
	</Router>,
	document.getElementById('root')
);

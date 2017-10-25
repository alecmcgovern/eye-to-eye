import React from 'react';

import './colorControls.css';

class ColorControls extends React.Component {


	render() {
		return (
			<div className="color-controls-container">
				<div className="color-control color-1"></div>					<div className="color-control color-2"></div>
				<div className="color-control color-3"></div>
				<div className="color-control color-4"></div>
				<div className="color-control color-5"></div>
				<div className="color-control color-6"></div>
				<div className="color-control color-7"></div>
			</div>
		);
	}
}

export default ColorControls;
import React from "react";
import ReactDOM from 'react-dom';
import Request from 'superagent';

export default class Tag extends React.Component {
	
	constructor(props){
		super(props);
	}
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

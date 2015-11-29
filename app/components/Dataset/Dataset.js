import React from "react";

export default class Dataset extends React.Component {
	
	constructor(props, context){
		super(props);
	}

	render () {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}



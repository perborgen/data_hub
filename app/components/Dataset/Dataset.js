import React from "react";

export default class Dataset extends React.Component {
	
	constructor(props, context){
		super(props);
	}

	render () {
        let children = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
				logged_in: this.props.logged_in
			});
        });

		return (
			<div>
				{children}
			</div>
		);
	}
}



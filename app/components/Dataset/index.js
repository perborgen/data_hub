import React from "react";

export default class Dataset extends React.Component {
	
	constructor(props, context){
		super(props);
	}

	render () {
		console.log('this: ', this);
        let children = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
				logged_in: this.props.logged_in
			});
        });

		return (
			<div className="col-md-10 col-md-offset-1 
								col-sm-10 col-sm-offset-1  
								col-lg-10 col-lg-offset-1 
								col-xs-10 col-xs-offset-1">
				{children}
			</div>
		);
	}
}



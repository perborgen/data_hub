import React from "react";
import DisqusThread from 'react-disqus-thread';

export default class Dataset extends React.Component {
	
	constructor(props, context){
		super(props);

	}

	render () {
		let identifier = this.props.params.datasetId;
		let url = "http://www.datasets.co/dataset/" + identifier;
        let children = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, this.props );
        });
		return (
			<div className="col-md-10 col-md-offset-1 
								col-sm-10 col-sm-offset-1  
								col-lg-10 col-lg-offset-1 
								col-xs-10 col-xs-offset-1">
				{children}
				<DisqusThread
					shortname="datasetsco"
					identifier={identifier}
					title="Datasets Comments"
					url={url}
			        />		
			</div>
		);
	}
}



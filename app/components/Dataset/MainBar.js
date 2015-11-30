import React from "react";
import DataDescription from "./DataDescription";
import DataTable from "./DataTable";

export default class MainBar extends React.Component {
	render () {
		return (
			<div>
				<div className="row"> 
					<div className="col-md-12 col-sm-12 col-lg-12 col-xs-12">
						<DataDescription 
							logged_in={this.props.logged_in}
							data={this.props.data} 
							updateUpvotes={this.props.updateUpvotes}/>
						<DataTable features={this.props.data.features} />
					</div>
				</div>
			</div>
		);
	}
}
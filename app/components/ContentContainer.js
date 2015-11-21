import React from "react";
import MainBar from "./MainBar";
import SideBar from "./SideBar";
import Request from 'superagent';

//import PathStore from 'react-router/modules/stores/PathStore';

let STATE = {
	title: "Western Australia Rental Prices",
	tags: ["prices", "regression"],
	dataAttributes: [
	{
		value: 0,
		name: "Upvotes"
	},
	{
		value: 0,
		name: "Comments"
	},
	{
		value: 18,
		name: "Features"
	},
	{
		value: 4869,
		name: "DataPoints"
	}],
	dataImage: "http://www.4land.com.au/wp-content/uploads/2013/04/new-affordable-housing-300x200.jpg",
	profile: "Per Harald Borgen",
	profileImage: ""
}

export default class ContentContainer extends React.Component {
	
	constructor(props, context){
		super(props);
		this.state = STATE;
		this.render = this.render.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	contextTypes: {
    	router: React.PropTypes.func.isRequired
  	}

  	componentDidMount(){
  		var path = this.props.params.datasetId;
  		console.log('this: ', this);
  		Request.get("/api/dataset/" + path)
  			.end((err, res) => {
  				console.log('dataset: ', res);
  				this.setState(res.body);
  			});
  	}


	render () {
		return (
			<div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-10 col-md-offset-1 
										col-sm-10 col-sm-offset-1  
										col-lg-10 col-lg-offset-1 
										col-xs-10 col-xs-offset-1">
							<MainBar data={this.state} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
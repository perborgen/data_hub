import React from "react";
import MainBar from "./MainBar";
import SideBar from "./SideBar";
import Request from 'superagent';

//import PathStore from 'react-router/modules/stores/PathStore';

let STATE = {
	title: "",
	tags: [],
	dataImage: "",
	profile: "",
	profileImage: "",
	upvotes: [],
	comments: [],
	scripts: []
}

export default class ContentContainer extends React.Component {
	
	constructor(props, context){
		super(props);
		this.state = STATE;
		this.render = this.render.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.updateUpvotes = this.updateUpvotes.bind(this);
	}

	updateUpvotes(upvotes){
		this.setState({
			upvotes: upvotes
		});
	}

	contextTypes: {
    	router: React.PropTypes.func.isRequired
  	}

  	componentDidMount(){
  		var path = this.props.params.datasetId;
  		Request.get("/api/dataset/" + path)
  			.end((err, res) => {
  				console.log('dataset: ', res);
  				this.setState(res.body);
  			});
  	}


	render () {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-10 col-md-offset-1 
									col-sm-10 col-sm-offset-1  
									col-lg-10 col-lg-offset-1 
									col-xs-10 col-xs-offset-1">
						<MainBar 
							data={this.state} 
							updateUpvotes={this.updateUpvotes} />
					</div>
				</div>
			</div>
		);
	}
}








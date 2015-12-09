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
		let new_number = this.state.num_upvotes +=1;
		this.setState({
			num_upvotes: new_number
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
		console.log('CC: logged_in: ', this.props.logged_in);
		return (
			<MainBar 
				data={this.state}
				logged_in = {this.props.logged_in}
				updateUpvotes={this.updateUpvotes} />
		);
	}
}








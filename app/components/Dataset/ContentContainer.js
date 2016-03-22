import React from "react";
import MainBar from "./MainBar";
import Request from 'superagent';

//import PathStore from 'react-router/modules/stores/PathStore';

let STATE = {
	title: "",
	tags: [],
	profile: "",
	img_url: "",
	s3_img_url: "",
	s3_url: "",
	url: "",
	upvotes: [],
	comments: [],
	comment: "",
	scripts: [],
	articles: [{
		link: "",
		title: ""
	}]
}

export default class ContentContainer extends React.Component {
	
	constructor(props, context){
		super(props);
		this.state = STATE;
		this.render = this.render.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.updateUpvotes = this.updateUpvotes.bind(this);
		this.onCommentFormChange = this.onCommentFormChange.bind(this);
		this.addComment = this.addComment.bind(this);

	}

	updateUpvotes(upvotes){
		let new_number = this.state.num_upvotes +=1;
		this.setState({
			num_upvotes: new_number
		});
	}

	onCommentFormChange(ev){
		this.setState({
			comment: ev.target.value
		});
	}

	addComment(){
		Request.post("/api/dataset/comment")
			.send({
				comment: this.state.comment,
				id: this.props._id,
				dataset_id: this.props.params.datasetId
			})
			.end( (err, response) => {
				if (err){
					throw err;
				}
				console.log('re')
				this.setState({
					comments: response.body.comments,
					comment: ""
				});
		});
	}

	contextTypes: {
    	router: React.PropTypes.func.isRequired
  	}

  	componentDidMount(){
  		var path = this.props.params.datasetTitle;
  		Request.get("/api/dataset/" + path)
  			.end((err, res) => {
  				this.setState(res.body);
  			});
  	}

	render () {
		return (
			<MainBar
				{...this.props}
				{...this.state}
				logged_in = {this.props.logged_in}
				updateUpvotes={this.updateUpvotes}
				addComment={this.addComment}
				onCommentFormChange={this.onCommentFormChange} />
		);
	}
}








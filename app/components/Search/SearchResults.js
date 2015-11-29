import React from "react";
import Request from 'superagent';

export default class SearchResults extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			datasets: []
		};
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount(){
		const searchQuery = this.props.params.searchQuery;
		console.log('this: ', this);
		Request.get("/api/search/" + searchQuery)
			.end((err, res) => {
				console.log('res: ', res);
				this.setState({
					datasets: res.body
				});
			});
  	}

  	render() {
  		let datasets = this.state.datasets.map( (dataset, index) => {
  			let link = "/dataset/d/" + dataset._id;
  			return (
				<p  key={index}>
					<a href={link}>{dataset.title}</a>
				</p>  					
  			);
  		});
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-10 col-md-offset-1 
									col-sm-10 col-sm-offset-1  
									col-lg-10 col-lg-offset-1 
									col-xs-10 col-xs-offset-1">
					{datasets}
					</div>
				</div>
			</div>
		);
	}
}
import React from "react";
import Request from 'superagent';


export default class FeaturedContainer extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			datasets: []
		}; 
	}

	componentDidMount(){
		Request.get("/api/datasets/featured")
			.end( (err, res) =>{
				this.setState({
					datasets: res.body
				});
			});
	}

	render() {
		let datasets = this.state.datasets.map( (dataset,index) => {
			return (
				<div key={index} className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<a href={dataset._id}>
					<div className="featured-dataset">
						<h5 style={{textAlign: 'center'}}>{dataset.title}</h5>
						<img className="featuredImg" style={{maxWidth: '150px',maxHeight: '100px', margin: '0 auto', display:'block', overflow: 'hidden'}} src={dataset.img_url} />
					</div>
					</a>
				</div>
			);
		});


		return ( 
			<div className="row" style={{margin: '20px 0px'}}>
				<div className="col-md-12 
								col-sm-12 
								col-lg-12 
								col-xs-12">
				{datasets}
				</div>
			</div>
		)
	}
}
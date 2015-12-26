import React from "react";
import Request from 'superagent';

export default class Tags extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			datasets: []
		};
		this.componentDidMount = this.componentDidMount.bind(this);
	}

	componentDidMount(){
		const tagId = this.props.params.tagId;
		Request.get("/api/tag/" + tagId)
			.end((err, res) => {
				console.log('res: ', res);
				this.setState({
					datasets: res.body
				});
			});
  	}

  	render() {
  		let tag = this.props.params.tagId;
  		let datasets = this.state.datasets.map( (dataset, index) => {
  			let link = "/dataset/" + dataset._id;
  			return (
  				<div  key={index}>
					<div className="col-xs-10 col-xs-offset-1 
									col-sm-6 col-sm-offset-0
									col-md-4 
									col-lg-4">
					<a href={"/dataset/" + dataset._id}>
						<div className="featured-dataset">
							<h5 style={{textAlign: 'center'}}>
							{dataset.title}
							</h5>
							<img 
								className="featuredImg"
								style={{
									maxWidth: '150px',
									maxHeight: '100px',
									margin: '0 auto',
									display:'block',
									overflow: 'hidden'
								}} 
								src={dataset.img_url.length > 0 ? dataset.img_url : dataset.s3_img_url}/>
						</div>
					</a>
					</div>
				</div>				
  			);
  		});
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-10 col-md-offset-1 
									col-sm-10 col-sm-offset-1  
									col-lg-10 col-lg-offset-1 
									col-xs-10 col-xs-offset-1">
					<ul className="tag-list">
						<li className="tag-item" style={{margin: '0 auto',display:'block',}}>
							<a href={"/tag/" + tag}>
								<span className="tag-text">
									{tag}
								</span>
							</a>
						</li>
					</ul>
					{datasets}
					</div>
				</div>
			</div>
		);
	}
}

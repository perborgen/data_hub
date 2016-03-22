import React from "react";
import Request from 'superagent';

export default class FeaturedDatasets extends React.Component {
	
	constructor(props){
		super(props); 
	}


	render() {
		let datasets = this.props.datasets.map( (dataset,index) => {
			return (
				<div key={index} className="col-xs-10 col-xs-offset-1 
											col-sm-6 col-sm-offset-0
											col-md-4 col-lg-4">
					<a href={"/dataset/" + dataset.title.split(' ').join('-')}>
					<div className="featured-dataset">
						<h4 style={{textAlign: 'center'}}>{dataset.title}</h4>
						<img 
							className="featuredImg" 
							style={{maxWidth: '150px',maxHeight: '100px', margin: '0 auto', display:'block', overflow: 'hidden'}} 
							src={dataset.img_url.length > 0 ? dataset.img_url : dataset.s3_img_url} />
					</div>
					</a>
				</div>
			);
		});


		return ( 
			<div className="row" style={{margin: '0px 0px'}}>
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
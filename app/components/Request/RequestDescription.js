import React from "react";
import Request from 'superagent';

export default class RequestDescription extends React.Component {

	render(){
		if (!this.props.data){
			return <p>Loading</p>;
		}
		let tags = this.props.data.tags.map( (tag,index) => {
			return (
				<li key={index} className="tag-item">
					<a href={"/tag/" + tag}>
						<span className="tag-text">
							{tag}
						</span>
					</a>
				</li>
				);
		});
		let clickable = this.props.logged_in ? "clickable": "";
		let user = this.props.data.user !==  undefined ? this.props.data.user : "Anonymous";

		return(
			<div>
				<div className="row">
						<div className="col-xs-12
										col-sm-10 col-sm-offset-1 
										col-md-6 col-md-offset-0
										col-lg-6">
							<h2 style={{marginTop: '0'}}>
							{this.props.data.title}
							</h2>
							<p>Uploaded by: {user}</p>
							<ul className="tag-list">
								{tags}
							</ul>
						</div>
				</div>
				
				<div className="row">
					<div className="col-xs-12
									col-sm-10 col-sm-offset-1 
									col-md-6 col-md-offset-0
									col-lg-6">
						<ul className="social-list"style={{listStyleType: 'none'}}>
							<li className={"social-item " + clickable} onClick={this.props.upvote}>
								<span className="social-text">
									<span 
										style={{top: '2px', right: '2px'}} 
										className={"glyphicon glyphicon-triangle-top"}> </span>
									Upvotes : {this.props.data.num_upvotes}
								</span>
							</li>
						</ul>
						<span className="request-dataset-offer">{this.props.data.paymentAmount} USD</span>
						<div>
							<h3>Description</h3>
							<p>{this.props.data.description}</p>
						</div>
						<div className="download-button-box">
							<a href={this.props.data.url}>
								<input 
									type="submit" 
									className="btn btn-success" 
									value="I have this dataset" />
							</a>
						</div>
					</div>
				</div>
			</div>

		);
	}
}



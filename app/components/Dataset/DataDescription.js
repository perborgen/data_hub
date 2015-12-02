import React from "react";
import Request from 'superagent';
import DataTable from "./DataTable";

export default class DataDescription extends React.Component {

	upvote(){
		if (this.props.logged_in) {
			Request.post("/api/dataset/upvote")
				.send({id: this.props.data._id})
				.end((err, res)=>{
					if(err) {
						console.log('err',err);
					}
					this.props.updateUpvotes(res.body.upvotes);
			});
		}
	}

	comment(){

	}

	scripts(){

	}

	render () {
		let tags = this.props.data.tags.map( (tag,index) => {
			return (
				<li key={index} className="tag-item">
					<a href={"/tag/t/" + tag}>
						<span className="tag-text">
							{tag}
						</span>
					</a>
				</li>
				);
		});
		let clickable = this.props.logged_in ? "clickable": "";
		return (
			<div>
				<div className="row">
						<div className="col-xs-12
										col-sm-10 col-sm-offset-1 
										col-md-6 col-md-offset-0
										col-lg-6">
							<h2 style={{marginTop: '0'}}>
							{this.props.data.title}
							</h2>
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
						<img className="dataset-img" 
							src={this.props.data.img_url} />
					</div>


					<div className="col-xs-12
									col-sm-10 col-sm-offset-1 
									col-md-6 col-md-offset-0
									col-lg-6">
						<ul className="social-list"style={{listStyleType: 'none'}}>
							<li className={"social-item " + clickable} onClick={this.upvote.bind(this)}>
								<span className="social-text">
									<span 
										style={{top: '2px', right: '2px'}} 
										className={"glyphicon glyphicon-triangle-top"}> </span>
									Upvotes : {this.props.data.num_upvotes}
								</span>
							</li>
						</ul>
						<div>
							<h3>Description</h3>
							<p>{this.props.data.description}</p>
						</div>
						<div className="download-button-box">
							<a href={this.props.data.url}>
								<input 
									type="submit" 
									className="btn btn-success" 
									value="Download dataset" />
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

DataDescription.defaultProps = {	
	data: {
			upvotes: []
		}
	};

						/*	<li className="social-item" onClick={this.comment}>
								<span className="social-text"> Comments : {this.props.data.comments.length}</span>
							</li>
							<li className="social-item" onClick={this.scripts}>
								<span className="social-text"> Scripts : {this.props.data.scripts.length}</span>
							</li>*/



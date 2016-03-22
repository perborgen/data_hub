import React from "react";
import Request from 'superagent';
import DataTable from "./DataTable";

export default class DataDescription extends React.Component {

	upvote(){
		if (this.props.username.length > 0) {
			Request.post("/api/dataset/upvote")
				.send({id: this.props._id})
				.end((err, res)=>{
					if(err) {
						throw err;
					}
					this.props.updateUpvotes(res.body.upvotes);
			});
		}
	}

	render () {
		let dataTable,
			articles,
			dataShape,
			articlesTitle = '';

		if (this.props.num_features) {
			dataShape = 
				<div>
					{this.props.num_instances > 0 ? <span className="dataset-shape">Features: {this.props.num_features}</span> : null }
					{this.props.num_instances > 0 ? <span className="dataset-shape">Instances: {this.props.num_instances}</span> : null }
				</div>;
		}
		

		if (this.props.features) {
			if (this.props.features[0].name.length > 0) {
				dataTable = <DataTable features={this.props.features} />;
			}
		};

		if (this.props.articles[0].link.length > 0) {
			articlesTitle = "Articles";
		}

		if (this.props.articles) {
			articles = this.props.articles.map( (article, index) => {
				return (
					<p key={index}><a href={article.link}>{article.title}</a></p>
				);
			});
		}

		let tags = this.props.tags.map( (tag,index) => {
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
		return (
			<div>
				<div className="row">
						<div className="col-xs-12
										col-sm-10 col-sm-offset-1 
										col-md-6 col-md-offset-0
										col-lg-6">
							<h2 style={{marginTop: '0'}}>
							{this.props.title}
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
							src={this.props.img_url.length > 0 ? this.props.img_url : this.props.s3_img_url} />
						{dataShape}
						{dataTable}
					</div>
					<div className="col-xs-12
									col-sm-10 col-sm-offset-1 
									col-md-6 col-md-offset-0
									col-lg-6">
						<ul className="social-list"style={{listStyleType: 'none'}}>
							<li className={"social-item " + clickable} onClick={this.upvote.bind(this)}>
								<span className="social-text">
									<span 
										style={{top: '2px', right: '2px', cursor: 'pointer'}} 
										className={"glyphicon glyphicon-star"}> </span>
									Favourite : {this.props.num_upvotes}
								</span>
							</li>
						</ul>
						<div>
							<h3>Description</h3>
							<p>{this.props.description}</p>
						</div>
						<div className="download-button-box">
							<a href={this.props.url.length > 0 ? this.props.url : this.props.s3_url}>
								<button 
									type="submit" 
									className="btn btn-success" >
								<span className="glyphicon glyphicon-link"></span>
								<span>Go to dataset</span>
								</button>
							</a>
						</div>
							<h3>{articlesTitle}</h3>
							<div>
								{articles}
							</div>
						</div>
					</div>
				</div>
		);
	}
}



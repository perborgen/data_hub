import React from "react";

export default class DataDescription extends React.Component {
	render () {
		console.log('this: ', this);
		let tags = this.props.data.tags.map( (tag,index) => {
			return (
				<li key={index} className="tag-item">
					<span className="tag-text">
						{tag}
					</span>
				</li>
				);
		});

		let dataAttributes = this.props.data.dataAttributes.map( (attribute,index) =>{
			return (<li className="social-item" key={index}><span className="social-text">{attribute.name} : {attribute.value.length}</span></li>)
		});
		return (
			<div>
				<h2 style={{marginTop: '0'}}>
					{this.props.data.title}
				</h2>
				<ul className="tag-list">
					{tags}
				</ul>
				<div className="uploaded-by">
					Uploaded by: {this.props.data.profile}
				</div>
				<div className="row">
					<div className="col-md-6 
									col-sm-6 
									col-lg-6 
									col-xs-6">
						<img className="dataset-img" 
							src={this.props.data.img_url} />
					</div>
					<div className="col-xs-6 
									col-sm-6 
									col-md-6 
									col-lg-6">
					<ul className="social-list"style={{listStyleType: 'none'}}>
						{dataAttributes}
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
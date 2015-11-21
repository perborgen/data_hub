import React from "react";

export default class DataDescription extends React.Component {
	render () {
		console.log('this: ', this);
		let tags = this.props.data.tags.map( (tag,index) => {
			return (
				<li key={index} className="tag">
					<span className="tag-text">
						{tag}
					</span>
				</li>
				);
		});

		let dataAttributes = this.props.data.dataAttributes.map( (attribute,index) =>{
			return (<li key={index}>{attribute.name} : {attribute.value}</li>)
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
						<img 
							style={{width:'100%'}} 
							src={this.props.data.img_url} />
					</div>
					<div className="col-xs-6 
									col-sm-6 
									col-md-6 
									col-lg-6">
						<ul>
							{dataAttributes}
						</ul>
						<a href={this.props.data.url}>
							<input 
								type="submit" 
								className="btn btn-success" 
								value="Download dataset" />
						</a>
					</div>
				</div>
			</div>
		);
	}
}
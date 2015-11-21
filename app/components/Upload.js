import React from "react";
import ReactDOM from 'react-dom';
import Request from 'superagent';

export default class Upload extends React.Component {
	
	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.state = {
			link: null,
			uploaded: false
		}
	}

	onSubmit(ev) {
		ev.preventDefault();
		var datasetName = ReactDOM.findDOMNode(this.refs.datasetName).value;
		var datasetUrl = ReactDOM.findDOMNode(this.refs.datasetUrl).value;
		var datasetImgUrl = ReactDOM.findDOMNode(this.refs.datasetImgUrl).value;
		var datasetTags = ReactDOM.findDOMNode(this.refs.datasetTags).value.split(",");
		
		Request.post("/api/dataset/new")
			.send({
				title: datasetName,
				url: datasetUrl,
				img_url: datasetImgUrl,
				tags: datasetTags
			})
			.end( (err, res) => {
				if (err){
					throw err;
				}
				console.log('res: ', res);
				this.setState({
					link: res.body._id,
					uploaded: true
				});
			});

	}

	render() {
		let content;

		if(this.state.uploaded ){
			content = (<div>
							<h3 style={{textAlign: 'center'}}>Well done!</h3>
							<p style={{textAlign: 'center'}}>You've uploaded your dataset.</p>
							<a href={this.state.link}>
								<input 
									type="submit" 
									className="btn-success"
									style={{margin: '0 auto', display: 'block'}} 
									value="Check it out" />
							</a>
						</div>);
		} else {
			content = (<form onSubmit={this.onSubmit}>
						<h2 style={{textAlign: 'center'}}>Upload your dataset</h2>
						<table className="uploadTable">
						<tbody>
						<tr>
							<td>
								<label htmlFor="datasetName" >Name of dataset</label>
							</td>
							<td>
								<input type="text" id="datasetName" ref="datasetName"/>
							</td>
							</tr>
						<tr>
							<td>
								<label htmlFor="datasetUrl">Url</label>
							</td>
							<td>
								<input type="text" id="datasetUrl" ref="datasetUrl"/>
							</td>
						</tr>
						<tr>
							<td>
								<label htmlFor="datasetImgUrl">Image URL</label>
							</td>
							<td>
								<input type="text" id="datasetImgUrl" ref="datasetImgUrl"/>
							</td>
						</tr>
						<tr>
							<td>
								<label htmlFor="datasetTags">Tags</label>
							</td>
							<td>
								<input type="text" id="datasetTags" ref="datasetTags"/>
							</td>
						</tr>
						<tr>
							<td>
								<input type="submit" value="Submit dataset" />
							</td>
						</tr>
						</tbody>
						</table>
					</form>)
		}

		return (
			<div>
				<div className="col-md-8 col-md-offset-2 
								col-sm-8 col-sm-offset-2 
								col-lg-8 col-lg-offset-2
								col-xs-8 col-lg-offset-2">
					{content}
				</div>
			</div>
		);
	}
}

import React from 'react';
import ReactDOM from 'react-dom';
import Request from 'superagent';
import update from 'react-addons-update';
import Dropzone from 'react-dropzone';

export default class Upload extends React.Component {
	
	constructor(props){
		super(props);
		this.submitDataset = this.submitDataset.bind(this);
		this.addFeatures = this.addFeatures.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.addArticle = this.addArticle.bind(this);
		this.toggleForm = this.toggleForm.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onChangeTags = this.onChangeTags.bind(this);
		this.onDropDataset = this.onDropDataset.bind(this);

		this.state = {
			link: null,
			datasetName: '',
			datasetUrl: '',
			s3DatasetUrl: '',
			datasetTags: '',
			datasetImgUrl: '',
			s3DatasetImgUrl: '',
			useDragImgForm: false,
			hasUploadedImage: false,
			uploaded: false,
			step: 0,
			features: [{
				name: "",
				description: "",
				example: ""
			}],
			datasetArticles: [{
				title: "",
				link: ""
			}]
		}
	}

	submitDataset(){
		Request.post("/api/dataset/new")
			.send({
				title: this.state.datasetName,
				url: this.state.datasetUrl,
				img_url: this.state.datasetImgUrl,
				tags: this.state.datasetTags,
				description: this.state.description,
				features: this.state.features,
				articles: this.state.datasetArticles
			})
			.end( (err, res) => {
				if (err){
					throw err;
				}
				console.log('res: ', res);
				this.setState({
					link: '/dataset/' + res.body._id,
					uploaded: true,
					step: 2
				});
			});

	}

	addFeatures(){
		let features = this.state.features;
		let new_features = update(features, {$push: [{name: "", description: "", example: ""}]});
		this.setState({
			features: new_features
		});
	}

	onChangeTags(inputField, ev) {
		let tags = ev.target.value.split(',');
		this.setState({
			datasetTags: tags
		});


	}

	onChange(inputField, ev){
		let new_state = {};
		new_state[inputField] = ev.target.value;
		this.setState(new_state);
	}

	addArticle(){
		let datasetArticles = this.state.datasetArticles.concat();
		datasetArticles.push({
			title: "",
			link: ""
		});
		this.setState({
			datasetArticles: datasetArticles
		})
	}

	onArticlesChange(index, titleOrUrl, ev) {
		let datasetArticles = this.state.datasetArticles.concat();
		datasetArticles[index][titleOrUrl] = ev.target.value;
		
		this.setState({
			datasetArticles: datasetArticles
		});
	}

	handleChange(index, name, ev){
		let value = ev.target.value;
		let features = this.state.features.concat();
		features[index][name] = value;
		this.setState({
			features: features
		});
	}

	uploadFile(data){
		console.log('data: ', data);
		Request.put(data.signed_request)
			.set('x-amz-acl', 'public-read')
			.send(data.file)
			.end((err, response) => {
				if (err) {
					console.log(err);
				}
				else {
					if (data.bucket === 'datasetimages2') {
						this.setState({
							s3DatasetImgUrl: data.url
						});
					}
					else if (data.bucket === 'datasetfiles') {
						this.setState({
							s3DatasetUrl: data.url
						});
				}

				}
			})
	}

	toggleForm(useDragForm, imageOrDataset){
		if (imageOrDataset === 'image') {
			this.setState({
				useDragImgForm: useDragForm
			});
		}
		else if (imageOrDataset === 'dataset') {
			this.setState({
				useDragDatasetForm: useDragForm
			});
		}
	
	}

	onDrop(files) {
	    var file = files[0];
	    console.log('file: ', file);
	    var url = '/api/signedurl?file_name="' + file.name + 
	    '"&file_type="' + file.type + "&bucket=datasetimages2";
	    Request.get(url, (err, response) => {
	    	console.log('response: ', response);
	    	this.uploadFile({
	    		file: file,
	    		bucket: 'datasetimages2',
	    		signed_request: response.body.signed_request, 
	    		url: response.body.url
	    	});
	    });
    }

	onDropDataset(files) {
	    var file = files[0];
	    console.log('file: ', file);
	    var url = '/api/signedurl?file_name="' + file.name + 
	    '"&file_type="' + file.type + "&bucket=datasetfiles";
	    Request.get(url, (err, response) => {
	    	console.log('response: ', response);
	    	this.uploadFile({
	    		file: file,
	    		bucket: 'datasetfiles',
	    		signed_request: response.body.signed_request, 
	    		url: response.body.url
	    	});
	    });
    }

	render() {
		let content;
		let tags;
		let imgInput;
		let datasetInput;

		if (this.state.useDragImgForm === true) {
			if (this.state.s3DatasetImgUrl.length > 0)  {
				imgInput = <p>Your image has been saved</p>;
			} 
			else {
				imgInput = (
					<div>
						<p>Drag and drop your image</p>
						<Dropzone onDrop={this.onDrop} />
					</div>
				);
			}
			
		} 
		else {
			imgInput = (
				<input
					className="form-control"
					value={this.state.datasetImgUrl} 
					onChange={this.onChange.bind(this, "datasetImgUrl")} 
					type="text" 
					id="datasetImgUrl" 
					ref="datasetImgUrl"/>
			);
		}

		if (this.state.useDragDatasetForm === true) {
			if (this.state.s3DatasetUrl.length > 0) {
				datasetInput = <p>Your dataset has been saved</p>;
			} else {
				datasetInput = (<Dropzone onDrop={this.onDropDataset} />);
			}
		} 
		else {
			datasetInput = (
				<input
					className="form-control"
					value={this.state.datasetUrl} 
					onChange={this.onChange.bind(this, "datasetUrl")}
					type="text" 
					id="datasetUrl" 
					ref="datasetUrl"/>
			);
		}


		if (this.state.datasetTags.length > 0) {
			tags = this.state.datasetTags.split(',').map((tag, index) => {
				return (
					<li key={index} className="tag-item">
							<span className="tag-text">
								{tag}
							</span>
					</li>
				);
			});
		}


		 

		let datasetArticles = this.state.datasetArticles.map((dataset, index) => {
			return (
				<div key={index}>
					<div className="form-group">
							<label htmlFor="datasetName">Link title</label>
							<input
								type="text"
								className="form-control"
								style={{marginTop: '5px'}}
								onChange={this.onArticlesChange.bind(this, index, 'title')}
								value={this.state.datasetArticles[index].title}
							/>
					</div>
					<div className="form-group">
							<label htmlFor="datasetName">Link url</label>
							<input
								type="text"
								className="form-control"
								style={{marginTop: '5px'}}
								onChange={this.onArticlesChange.bind(this, index, 'link')}
								value={this.state.datasetArticles[index].link}
							/>
					</div>
				</div>
			);
		});

		let featureboxes = this.state.features.map( (feature, index) => {
			return (
				<tr key={index} >
					<td>
						<input
							className="feature-form-input form-control"
							type="text" 
							onChange={this.handleChange.bind(this, index, "name")}/>
					</td>
					<td>
						<input
							className="feature-form-input form-control" 
							type="text" 
							onChange={this.handleChange.bind(this, index, "description")}/>
						</td>
					<td>
						<input 
							className="feature-form-input form-control"
							type="text" 
							onChange={this.handleChange.bind(this, index, "example")}/>
					</td>	
				</tr>
			);
		});

		if (this.state.step === 0){
			content = (
				<div>
					<h3 style={{textAlign: 'center'}}>Upload your dataset</h3>
					<div className="form-group">
						<label htmlFor="datasetName" >Name of dataset</label>
						<input
							className="form-control"
							value={this.state.datasetName} 
							onChange={this.onChange.bind(this, "datasetName")} 
							type="text" 
							id="datasetName" 
							ref="datasetName"/>
						</div>
					  	<div className="form-group">
							<label htmlFor="datasetUrl">Dataset</label>
						<br/>
						<div className="btn-group upload-img-control" role="group" aria-label="...">
							<button onClick={this.toggleForm.bind(null, false, 'dataset')} type="button" className="btn btn-default">Enter dataset URL</button>
							<button onClick={this.toggleForm.bind(null, true, 'dataset')} type="button" className="btn btn-default">Upload dataset</button>
						</div>
							{datasetInput}
						</div>
					  	<div className="form-group">
						<label htmlFor="datasetImgUrl">Image</label>
						<br/>
						<div className="btn-group upload-img-control" role="group" aria-label="...">
							<button onClick={this.toggleForm.bind(null, false, 'image')} type="button" className="btn btn-default">Enter image URL</button>
							<button onClick={this.toggleForm.bind(null, true, 'image')} type="button" className="btn btn-default">Upload image</button>
						</div>
							{imgInput}
						</div>
					  	<div className="form-group">
							<label htmlFor="datasetTags">Tags (separate with commas)</label>
							<input
								className="form-control"
								value={this.state.datasetTags} 
								onChange={this.onChangeTags.bind(this, "datasetTags")}  
								type="text" 
								id="datasetTags" 
								ref="datasetTags"/>
							<ul className="tag-list">
								{tags}
							</ul>
						</div>
					  	<div className="form-group">
							<label htmlFor="description">Description</label>
							<textarea
								className="form-control"
								value={this.state.description} 
								onChange={this.onChange.bind(this, "description")}  
								type="text" 
								id="description" 
								ref="description"/>
						</div>
					<div className="feature-form-container">
						<h3 style={{textAlign: 'center'}}>Please describe the dataset's features</h3>
						<table className="feature-form">
							<thead>
								<tr>
									<th>Feature</th>
									<th>Description</th>
									<th>Example</th>
								</tr>
							{featureboxes}
							</thead>
						</table>
					<button onClick={this.addFeatures} className="btn btn-default btn-sm">
						<span className="glyphicon glyphicon-plus"></span>
						Add new feature
					</button>
					<br/>
					</div>
						<div>
							<h3 style={{textAlign: 'center'}}>Add any relevant links about the dataset</h3>
							{datasetArticles}
						<button
							onClick={this.addArticle} 
							className="btn btn-default btn-sm">
							<span className="glyphicon glyphicon-plus"></span>
							Add new link
						</button>
					</div>
					<div className="submit-dataset-container">
						<button
							style={{marginTop: '30px'}} 
							onClick={this.submitDataset} 
							className="btn btn-success submit-dataset-button">
							Submit dataset
						</button>
					</div>
					</div>
				);
		}
		else if (this.state.step === 2 ){	
			content = (
				<div>
					<h3 style={{textAlign: 'center'}}>Well done!</h3>
					<p style={{textAlign: 'center'}}>You've created your dataset.</p>
					<a href={this.state.link}>
						<button 
							type="submit" 
							className="btn btn-success"
							style={{margin: '0 auto', display: 'block'}} >
							Check it out
						</button>
					</a>
				</div>
			);
		} 


		return (
			<div>
				<div className="col-md-8 col-md-offset-2 
								col-sm-8 col-sm-offset-2 
								col-lg-6 col-lg-offset-3
								col-xs-8 col-xs-offset-2">
					{content}
				</div>
			</div>
		);
	}
}

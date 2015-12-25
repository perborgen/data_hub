import React from 'react';
import Request from 'superagent';
import ReactS3Uploader from 'react-s3-uploader';
var Dropzone = require('react-dropzone');

export default class TestUpload extends React.Component {
	
	constructor(props) {
		super(props);
		this.onDrop = this.onDrop.bind(this);
		this.state = {
			img_url: ""
		}
	}

	handleSubmit(ev){
		console.log('submit');
		ev.preventDefault();
		var self = this;
	    var reader = new FileReader();
	    var file = ev.target.files[0];
	    console.log('file: ', file);

	}

	handleChange(ev){
		console.log('handleChange');
	}

	uploadFile(file, signed_request, url){
		console.log('signed_request: ', signed_request);

		Request.put(signed_request)
			.set('x-amz-acl', 'public-read')
			.send(file)
			.end((err, response) => {
				if (err) {
					console.log(err);
				}
				console.log('response put:', response);
				this.setState({
					img_url: url
				})
			})
/*	    var xhr = new XMLHttpRequest();
		    xhr.open("PUT", signed_request);
		    xhr.setRequestHeader('x-amz-acl', 'public-read');
		    xhr.onload = function() {
		        if (xhr.status === 200) {
		           
		        }
		    };
		    xhr.onerror = function() {
		        alert("Could not upload file.");
		    };
		    xhr.send(file);*/
	}

	onDrop(files) {
	    var file = files[0];
	    console.log('file:', file);
	    var url = '/api/signedurl?file_name="' + file.name + '"&file_type="' + file.type;
	    Request.get(url, (err, response) => {
	    	console.log('response: ', response);
	    	this.uploadFile(file, response.body.signed_request, response.body.url);
	    });
    }

	render(){
		return (
			<div>
				<form  
					onSubmit={this.handleSubmit}
					action="/api/testupload" 
					encType="multipart/form-data">
				<input type="file" onChange={this.handleChange}/>
				<input type="submit"/>
				</form>
				<Dropzone
					onDrop={this.onDrop} />
				<img src={this.state.img_url} />
			</div>
		);
	}
}

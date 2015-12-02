import React from 'react';
import ReactDOM from 'react-dom';
import SuperRequest from 'superagent';
import update from 'react-addons-update';

export default class Request extends React.Component {
	
	constructor(props){
		super(props);

		this.submitDetails = this.submitDetails.bind(this);
		this.submitDescription = this.submitDescription.bind(this);
		this.submitWouldPay = this.submitWouldPay.bind(this);
		this.submitPayAmount = this.submitPayAmount.bind(this);
		this.submitFinal = this.submitFinal.bind(this);

		this.state = {
			link: null,
			finished: false,
			amount: 0,
			step: 0,
			title: "",
			img_url: "",
			tags: "",
			description: "",
			datasetFeatures: "",
			user: ""
		}
	}

	submitDetails(ev){
		console.log('PRESUBMIT')
		ev.preventDefault();
		let datasetName = ReactDOM.findDOMNode(this.refs.datasetName).value;
		let datasetTags = ReactDOM.findDOMNode(this.refs.datasetTags).value.split(",");
		let datasetFeatures = ReactDOM.findDOMNode(this.refs.datasetFeatures).value;
		this.setState({
			step: 1,
			title: datasetName,
			tags: datasetTags,
			datasetFeatures: datasetFeatures,
			user: 'test'
		});
	}

	submitDescription() {
		let datasetDescription = ReactDOM.findDOMNode(this.refs.datasetDescription).value;
		this.setState({
			description: datasetDescription,
			step: 2
		});
	}

	submitWouldPay(willingToPay, ev){
		let next_step = willingToPay === true ? 3 : 4;
		console.log('next_step: ', next_step);
		this.setState({
			step: next_step
		});
	}

	submitPayAmount(amount, ev){
		this.setState({
			amount: amount,
			step: 4
		});
	}

	submitFinal() {
		let paymentAmount = ReactDOM.findDOMNode(this.paymentAmount).value;
		SuperRequest.post("/api/request/new")
			.send({
				title: this.state.title,
				url: this.state.url,
				img_url: this.state.img_url,
				tags: this.state.tags,
				description: this.state.description,
				user: 'test',
				paymentAmount: paymentAmount
			})
			.end( (err, res) => {
				if (err){
					throw err;
				}
				console.log('res: ', res);
				this.setState({
					link: '/request/id/' + res.body._id,
					finished: true,
				});
			});
	}

	render() {
		let content;
		if (this.state.logged_in === false ){
			return (<p>You have to be logged in to request datasets</p>);
		}
		if (this.state.step === 0){
			content = (
				<form onSubmit={this.submitDetails}>
					<h2 style={{textAlign: 'center'}}>Request a dataset</h2>
					<table className="uploadTable">
					<tbody>
					<tr>
						<td>
							<label htmlFor="datasetName" >Name:</label>
						</td>
						<td>
							<input type="text" id="datasetName" ref="datasetName"/>
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
							<label htmlFor="datasetFeatures">Preferred features</label>
						</td>
						<td>
							<input type="text" id="datasetFeatures" ref="datasetFeatures"/>
						</td>
					</tr>
					<tr>
						<td>
							<input type="submit" value="Next step" />
						</td>
					</tr>
					</tbody>
				</table>
			</form>
			)
		}

		else if (this.state.step === 1) {
			content = (
				<div>
					<p>Please describe your requested dataset:</p>
					<textarea ref="datasetDescription"></textarea>
					<br />
					<input type="submit" onClick={this.submitDescription} className="btn btn-default" />
				</div>
			);
		}

		else if (this.state.step === 2) {
			content = (
				<div>
					<p>Will you offer to pay for this dataset?</p>
					<input 
						className="btn btn-default" 
						type="submit" value="Yes" 
						onClick={this.submitWouldPay.bind(this, true)} />
					<input 
						className="btn btn-default" 
						type="submit" value="No"  
						onClick={this.submitWouldPay.bind(this, false)} />
				</div>
			);
		}

		else if (this.state.step === 3) {
			content = (
				<div>
					<p>How much?</p>
					<input 
						className="btn btn-default" 
						type="text"
						ref="paymentAmount" />
					<input
						type="submit"
						className="btn btn-default"
						value="Submit request"
						onClick={this.submitPayAmount} />
				</div>
			);
		}

		else if (this.state.step === 4) {
			content = (
				<div>
					<h3 style={{textAlign: 'center'}}>Well done!</h3>
					<p style={{textAlign: 'center'}}>You've created a dataset.</p>
					<a href={this.state.link}>
						<input 
							type="submit" 
							className="btn-success"
							style={{margin: '0 auto', display: 'block'}} 
							value="Check it out" />
					</a>
				</div>);	

		} 
		return (
			<div>
				<div className="col-md-8 col-md-offset-2 
								col-sm-8 col-sm-offset-2 
								col-lg-8 col-lg-offset-2
								col-xs-8 col-lg-offset-2">
					<div style={{margin: '0 auto'}}>
					{content}
					</div>
				</div>
			</div>
		);
	}
}
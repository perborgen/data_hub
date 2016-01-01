import React from "react";

let DATAFEATURES = [
	{
		name: "",
		description: "",
		example: ""
	}
]

export default class DataTable extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			limit: 6
		}
		this.toggleLimit = this.toggleLimit.bind(this);
	}

	getDefaultsProps() {

	}

	toggleLimit() {
		let new_limit;
		if (this.state.limit === 6) {
			new_limit = Infinity;
		} else if (this.state.limit === Infinity) {
			new_limit = 6;
		}
		this.setState({
			limit: new_limit
		});
	}

	render () {
		if (this.props.features) {
			DATAFEATURES = this.props.features;
		}

		let expandButton;
		if (this.props.features && this.props.features.length > 6) {
			console.log('this.props.features.length: ', this.props.features.length);
			expandButton = (
				<tr>
					<td className="dataset-td dataset-actual-value">
					<button onClick={this.toggleLimit}>
						{this.state.limit === 6 ? "View entire table": "View less"}
					</button>
					</td>
					<td className="dataset-td dataset-actual-value">
					</td>
					<td className="dataset-td dataset-actual-value">
					</td>
				</tr>
			);
		}

		let features = DATAFEATURES.map( (feature, index, array) => {

			if (index >= this.state.limit) {
				return null;
			}


			let rowColor = "";
			if (index % 2 !== 0) {
				rowColor = "dataset-tr-color"
			}


			return (
				<tr key={index} className={"dataset-tr " + rowColor}>
					<td className="dataset-td dataset-actual-value">
					{feature.name}
					</td>
					<td className="dataset-td">
					{feature.description}
					</td>
					<td className="dataset-td dataset-actual-value">
					{feature.example}
					</td>
				</tr>
			);
		});

		return (
			<div className="row" style={{marginTop: '30px', marginBottom: '30px'}}>
				<div className="
					col-xs-12
					col-sm-10
					col-md-12
					col-lg-12">
					<div>
						<table className="dataset-table">
							<thead className="dataset-thead">
							<tr>
							<th className="dataset-th">
								Feature
							</th>
							<th className="dataset-th">
								Description
							</th>
							<th className="dataset-th">
								Example
							</th>
							</tr>
							</thead>
							<tbody>
								{features}
							{expandButton}
							</tbody>

						</table>
					</div>
				</div>
			</div>
		);
	}
}

DataTable.defaulProps = {
	features: []
}
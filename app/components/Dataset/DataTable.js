import React from "react";

let DATAFEATURES = [
	{
		name: "age",
		description: "The patients age",
		example: 46
	},
	{
		name: "blood_p",
		description: "The patients bloood pressure",
		example: "90/120"
	},
	{
		name: "smoker",
		description: "Does the patient smoke. 0 or 1",
		example: 1
	}
]

export default class DataTable extends React.Component {
	render () {

		if (this.props.features) {
			DATAFEATURES = this.props.features;
		}

		let features = DATAFEATURES.map( (feature, index) => {

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
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}
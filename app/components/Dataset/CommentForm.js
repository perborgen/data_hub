import React from "react";
import Request from 'superagent';

export default class CommentSection extends React.Component {

	render () {
		return (
			<div>
				<textarea 
					value={this.props.comment}
					onChange={this.props.onCommentFormChange} />
				<br />
				<button 
					type="submit"
					onClick={this.props.addComment}
					className="btn btn-default btn-sm" >
					Submit
				</button>
			</div>
		);
	}
}
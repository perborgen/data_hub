import React from "react";
import Request from 'superagent';
import CommentForm from './CommentForm';

export default class CommentSection extends React.Component {

	render () {
		console.log('this: ', this);
		let comments = this.props.comments.map( (comment, id) => {
			return (
				<div key={id}>
					<p>{comment.text}</p>
					<p>{comment.username}</p>
				</div>
			);
		});

		return (
			<div>
			<h3>Comments</h3>
				{comments}
				<CommentForm {...this.props} />
			</div>
		);
	}
}
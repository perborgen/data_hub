/**
 * List.js
 * In the Hello.js example, creates a list of elements
 * @author: Ben Gundersen
 */
'use strict';

var React = require('react');

module.exports = React.createClass({

  render: function() {
    var listItems = [];
    if(this.props.items > 0) {
      // Creating an array using the spread operator lets you map over it to build an array
      // of elements from an integer (similar to Underscore/Lodash _.times function).
      listItems = [...Array(this.props.items)].map((n, index) =>
        <li key={index}>{ 'Item ' + index }</li>
      );
    }
    return (
      <ul>
        { listItems }
      </ul>
    );
  }

});
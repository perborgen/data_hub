var React = require('react');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      style: {
        backgroundColor: 'rgb(255,0,0)',
      }
    }
  },

  getRandomColor: function() {
    var color = [
      Math.floor(Math.random()*255),
      Math.floor(Math.random()*255),
      Math.floor(Math.random()*255)
    ].join(',');
    return 'rgb('+color+')';
  },

  handleClick: function() {
    this.setState({
      style: {
        backgroundColor: this.getRandomColor()
      }
    });
    this.props.handleClick();
  },

  render: function() {
    return (
      <button style={ this.state.style } onClick={ this.handleClick }>{ this.props.children }</button>
    );
  }

});

const React = require('react'),
      d3 = require('d3');

var Candidate = React.createClass({
    render: function () {
        return (
            <circle cx={this.props.x}
                    cy={this.props.y}
                    r="5" />
        );
    }
});

module.exports = Candidate;

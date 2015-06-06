
const React = require('react'),
      d3 = require('d3');

const ApplicantsChart = React.createClass({
    getDefaultProps: function () {
        return {
            width: 800,
            height: 300
        };
    },

    render: function () {
        return (
            <svg width={this.props.width} height={this.props.height}>
            </svg>
        );
    }
});

module.exports = ApplicantsChart;

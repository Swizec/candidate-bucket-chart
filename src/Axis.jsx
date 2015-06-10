
const React = require('react'),
      d3 = require('d3');

const Axis = React.createClass({
    componentWillMount: function () {
        this.axis = d3.svg.axis()
                      .scale(this.props.yScale)
                      .orient("left");

        this.update_d3(this.props);
    },

    componentWillReceiveProps: function (newProps) {
        this.update_d3(newProps);
    },

    update_d3: function (props) {
        this.axis
            .ticks(10);
    },

    componentDidUpdate: function () { this.renderAxis(); },
    componentDidMount: function () { this.renderAxis(); },

    renderAxis: function () {
        var node = this.getDOMNode();

        d3.select(node).call(this.axis);
    },

    render: function () {
        var translate = "translate("+(this.props.margin.left)+", 0)";
        return (
            <g className="axis" transform={translate}>
            </g>
        );
    }
});

module.exports = Axis;

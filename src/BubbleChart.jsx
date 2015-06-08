
const React = require('react'),
      d3 = require('d3');

const Candidate = require('./Candidate');

var BubbleChart = React.createClass({

    getDefaultProps: function () {
        var time_format = d3.time.format('%d/%m/%Y');

        return {
            y_value: function (d) {
                return d.OverallScore;
            },
            x_value: function (d) {
                return time_format.parse(d.Candidate["Date of Birth"]);
            },
            margin: {
                top: 10,
                bottom: 10,
                left: 50,
                right: 10
            }
        };
    },

    componentWillMount: function () {
        this.yScale = d3.scale.linear();
        this.xScale = d3.scale.linear();

        this.update_d3(this.props);
    },

    componentWillReceiveProps: function (newProps) {
        this.update_d3(newProps);
    },

    update_d3: function (props) {
        this.yScale
            .domain([
                d3.min(props.data.Responses.map(props.y_value)),
                d3.max(props.data.Responses.map(props.y_value))
            ])
            .range([
                props.margin.bottom,
                props.height-this.props.margin.top
            ]);

        this.xScale
            .domain([
                d3.min(props.data.Responses.map(props.x_value)),
                d3.max(props.data.Responses.map(props.x_value))
            ])
            .range([
                props.margin.left,
                props.width-props.margin.right
            ]);
    },

    render: function () {
        return (
            <svg width={this.props.width} height={this.props.height}>
                {this.props.data.Responses.map(function (d) {
                    return (
                        <Candidate x={this.xScale(this.props.x_value(d))}
                                   y={this.yScale(this.props.y_value(d))}
                                   key={"candidate-"+d.Candidate.Nid} />
                    );
                 }.bind(this))}
            </svg>
        );
    }
});

module.exports = BubbleChart;

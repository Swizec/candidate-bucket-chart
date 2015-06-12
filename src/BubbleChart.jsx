
const React = require('react'),
      _ = require('lodash'),
      d3 = require('d3');

const Candidate = require('./Candidate'),
      PassLine = require('./PassLine'),
      BucketCounts = require('./BucketCounts'),
      Axis = require('./Axis');

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
            r_value: function (d) {
                return d.OverallScore;
            },
            margin: {
                top: 10,
                bottom: 10,
                left: 20,
                right: 65
            }
        };
    },

    getInitialState: function () {
        return {
            passValue: 0
        };
    },

    componentWillMount: function () {
        this.yScale = d3.scale.linear();
        this.xScale = d3.scale.linear();
        this.rScale = d3.scale.linear();

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
                props.height-this.props.margin.bottom,
                props.margin.top
            ]);

        this.rScale
            .domain([
                d3.min(props.data.Responses.map(props.r_value)),
                d3.max(props.data.Responses.map(props.r_value))
            ])
            .range([
                1,
                this.props.max_r
            ]);

        this.xScale
            .domain([
                d3.min(props.data.Responses.map(props.x_value)),
                d3.max(props.data.Responses.map(props.x_value))
            ])
            .range([
                props.margin.left+props.max_r,
                props.width-props.margin.right-props.max_r
            ]);
    },

    updatePass: function (y) {
        var value = d3.round(this.yScale.invert(y));

        this.setState({passValue: value});
    },

    hide_tooltips: function (event) {
        _.keys(this.refs).forEach(function (key) {
            var component = this.refs[key];

            if (!event.dispatchMarker.match(key)
                    && component.hide_tooltip) {
                component.hide_tooltip()
            }
        }.bind(this));
    },

    render: function () {
        var median = d3.median(this.props.data.Responses.map(this.props.y_value)),
            initialY = this.yScale(median);

        var passValue = this.state.passValue || median,
            lineY = this.yScale(passValue);

        return (
            <svg width={this.props.width}
                 height={this.props.height}
                 onMouseDown={this.hide_tooltips}>
            {this.props.data.Responses.map(function (d) {
                var passed = this.props.y_value(d) > (this.state.passValue || median);

                return (
                    <Candidate x={this.xScale(this.props.x_value(d))}
                               y={this.yScale(this.props.y_value(d))}
                               r={this.rScale(this.props.r_value(d))}
                               max_r={this.props.max_r}
                               key={"candidate-"+d.Candidate.Nid}
                               data={d}
                               maxWidth={this.props.width}
                               maxHeight={this.props.height}
                               passed={passed}
                               ref={"candidate-"+d.Candidate.Nid} />
                );
             }.bind(this))}

            <Axis {...this.props} yScale={this.yScale}/>

            <PassLine minY={this.props.margin.top}
                      maxY={this.props.height-this.props.margin.bottom}
                      passValue={passValue}
                      initialY={initialY}
                      updatePass={this.updatePass}
                      margin={this.props.margin} />

            <BucketCounts data={this.props.data}
                          width={this.props.width}
                          height={this.props.height}
                          lineY={lineY}
                          y_value={this.props.y_value}
                          passValue={passValue} />

            <use id="use"></use>

            </svg>
        );
    }
});

module.exports = BubbleChart;

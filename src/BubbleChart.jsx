
const React = require('react'),
      _ = require('lodash'),
      d3 = require('d3');

const Candidate = require('./Candidate'),
      CandidateTooltip = require('./CandidateTooltip'),
      PassLine = require('./PassLine'),
      BucketCounts = require('./BucketCounts'),
      Axis = require('./Axis');

var BubbleChart = React.createClass({

    getDefaultProps: function () {
        var random = d3.random.irwinHall(5);

        return {
            y_value: function (d) {
                return d.OverallScore;
            },
            x_value: function (d) {
                return d.randomProp;
            },
            r_value: function (d) {
                return d.OverallScore;
            },
            margin: {
                top: 10,
                bottom: 10,
                left: 25,
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
        this.zoomScaleMultiplier = d3.scale.linear()
                                     .domain([1, 8])
                                     .range([1, 1.6]);
        this.zoom = d3.behavior.zoom()
                      .x(this.xScale)
                      .y(this.yScale)
                      .scaleExtent(this.zoomScaleMultiplier.domain())
                      .on("zoom", this.onZoom);

        this.update_d3(this.props);
    },

    componentWillReceiveProps: function (newProps) {
        this.update_d3(newProps);
    },

    update_d3: function (props) {
        this.yScale
            .domain([
                0,
                100
            ])
            .range([
                props.height-props.margin.bottom,
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

        this.panExtent = {x: this.xScale.domain(),
                          y: this.yScale.domain()};

        this.zoom
            .x(this.xScale)
            .y(this.yScale)
            .size([props.width, props.height]);
    },

    componentDidMount: function () {
        d3.select(this.getDOMNode())
          .call(this.zoom);
    },

    onZoom: function () {
        let multiplier = this.zoomScaleMultiplier(d3.event.scale);

        this.rScale.range(
            [1, this.props.max_r].map(function (v) {
                return v*multiplier;
            }));

        this.panLimit();
        this.forceUpdate();
    },

    panLimit: function () {
        let panExtent = this.panExtent,
            y = this.yScale,
            x = this.xScale,
            zoom = this.zoom,
            height = this.props.height,
            width = this.props.width;

        // taken from http://bl.ocks.org/garrilla/11280861
        var divisor = {h: height / ((y.domain()[1]-y.domain()[0])*zoom.scale()), w: width / ((x.domain()[1]-x.domain()[0])*zoom.scale())},
	    minX = -(((x.domain()[0]-x.domain()[1])*zoom.scale())+(panExtent.x[1]-(panExtent.x[1]-(width/divisor.w)))),
	    minY = -(((y.domain()[0]-y.domain()[1])*zoom.scale())+(panExtent.y[1]-(panExtent.y[1]-(height*(zoom.scale())/divisor.h))))*divisor.h,
	    maxX = -(((x.domain()[0]-x.domain()[1]))+(panExtent.x[1]-panExtent.x[0]))*divisor.w*zoom.scale(),
	    maxY = (((y.domain()[0]-y.domain()[1])*zoom.scale())+(panExtent.y[1]-panExtent.y[0]))*divisor.h*zoom.scale(),

	    tx = x.domain()[0] < panExtent.x[0] ?
		 minX :
		 x.domain()[1] > panExtent.x[1] ?
		 maxX :
		 zoom.translate()[0],
	    ty = y.domain()[0]  < panExtent.y[0]?
		 minY :
		 y.domain()[1] > panExtent.y[1] ?
		 maxY :
		 zoom.translate()[1];

	this.zoom.translate([tx,ty]);
    },

    updatePass: function (y) {
        var value = d3.round(this.yScale.invert(y));

        this.setState({passValue: value});
    },

    hide_tooltips: function (event) {
        _.keys(this.refs).forEach(function (key) {
            var component = this.refs[key];

            if (!event.dispatchMarker.match(key)
                    && key.match(/^candidate-tooltip/)) {
                component.hide();
            }
        }.bind(this));
    },

    toggle_tooltip: function (id) {
        let tooltip = this.refs["candidate-tooltip-"+id];

        tooltip.toggle();
    },

    __build_candidates: function (median) {
        return (<g>
            {this.props.data.Responses.map(function (d) {
                var passed = this.props.y_value(d) > (this.state.passValue || median);

                return (
                    <Candidate x={this.xScale(this.props.x_value(d))}
                               y={this.yScale(this.props.y_value(d))}
                               r={this.rScale(this.props.r_value(d))}
                               max_r={this.props.max_r}
                               key={"candidate-"+d.id}
                               data={d}
                               maxX={this.props.width-this.props.margin.right}
                               maxY={this.props.height-this.props.margin.bottom}
                               minX={this.props.margin.left}
                               minY={this.props.margin.top}
                               passed={passed}
                               ref={"candidate-"+d.id}
                               toggle_tooltip={this.toggle_tooltip} />
                );
            }, this)}
            </g>);
    },

    __build_tooltips: function () {
        return (
            <g>
                {this.props.data.Responses.map(function (d) {
                    return (
                        <CandidateTooltip
                        x={this.xScale(this.props.x_value(d))}
                        y={this.yScale(this.props.y_value(d))}
                        maxX={this.props.width-this.props.margin.right}
                        maxY={this.props.height-this.props.margin.bottom}
                        minX={this.props.margin.left}
                        minY={this.props.margin.top}
                        key={"candidate-tooltip-"+d.id}
                        ref={"candidate-tooltip-"+d.id}
                        shown={false}
                        data={d} />
                    );
                 }, this)}
            </g>);
    },

    render: function () {
        let median = d3.median(this.props.data.Responses.map(this.props.y_value)),
            passValue = this.state.passValue || median,
            lineY = this.yScale(passValue),
            metaTools = null;

        if (this.props.data.Responses.length) {
            metaTools = (
                <g>
                    <PassLine minY={this.props.margin.top}
                              maxY={this.props.height-this.props.margin.bottom}
                              passValue={passValue}
                              y={lineY}
                              updatePass={this.updatePass}
                              margin={this.props.margin} />

                    <BucketCounts data={this.props.data}
                                  width={this.props.width}
                                  height={this.props.height}
                                  lineY={lineY}
                                  y_value={this.props.y_value}
                                  passValue={passValue} />
                </g>
            );
        }

        let candidates = this.__build_candidates(median),
            tooltips = this.__build_tooltips();

        return (
            <svg width={this.props.width}
                 height={this.props.height}
                 onMouseDown={this.hide_tooltips}>
            {candidates}
            <Axis {...this.props} yScale={this.yScale}/>

            {metaTools}

            {tooltips}
            </svg>
        );
    }
});

module.exports = BubbleChart;

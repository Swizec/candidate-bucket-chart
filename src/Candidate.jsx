
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

var Candidate = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {tooltip_shown: false,
                width: 12,
                height: 12,
                y_offset: 0,
                x_offset: 0};
    },

    show_tooltip: function () {
        this.setState({tooltip_shown: true});
    },

    hide_tooltip: function () {
        this.setState({tooltip_shown: false,
                       x_offset: 0,
                       y_offset: 0});
    },

    fixSize: function (info) {
        this.setState(info);
    },

    render: function () {
        return (
            <g transform={"translate("+(this.props.x+this.state.x_offset)+", "+(this.props.y+this.state.y_offset)+")"}
               width={this.state.width}
               height={this.state.height}
               onMouseOver={this.show_tooltip}
               onMouseLeave={this.hide_tooltip}>
                <circle cx={this.props.r/2-this.state.x_offset}
                        cy={this.props.r/2-this.state.y_offset}
                        r={this.props.r}
                        />
                <CandidateTooltip
                        display={this.state.tooltip_shown ? "block" : "none"}
                        tellSize={this.fixSize}
                        {... this.props} />
            </g>
        );
    }
});

var CandidateTooltip = React.createClass({
    mixins: [PureRenderMixin],

    getDefaultProps: function () {
        return {
            width: 200,
            height: 50,
        };
    },

    getInitialState: function () {
        return {
            x_offset: 0,
            y_offset: 0
        };
    },

    componentWillMount: function () {
        this.calc_offsets(this.props);
    },

    componentWillReceiveProps: function (props) {
        this.calc_offsets(props);
    },

    calc_offsets: function (props) {
        var x_offset = 0,
            y_offset = 0;

        if (props.x+props.width > props.maxWidth) {
            x_offset  = -props.width;
        }
        if (props.y+props.height > props.maxHeight) {
            y_offset = -props.height
        }

        if (this.props.tellSize) {
            this.props.tellSize({
                x_offset: x_offset,
                y_offset: y_offset,
                width: props.width,
                height: props.height
            });
        }
    },

    render: function () {
        var candidate = this.props.data.Candidate;

        return (
            <foreignobject className="node"
                           x="0"
                           y="0"
                           width={this.props.width}
                           height={this.props.height}
                           style={{display: this.props.display}}>
                <div>
                    <img style={{width: 50, height: 50, float: "left", 'margin-right': 5}} />
                    <a href="#"><strong>{candidate.Name}</strong></a> <br />
                    {candidate.CurrentJobTitle} <br />
                    {candidate.Location}
                </div>
            </foreignobject>
        );
    }
});

module.exports = Candidate;

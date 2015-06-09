
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

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
                    <img style={{width: 50, height: 50, float: "left", marginRight: 5}} />
                    <a href="#"><strong>{candidate.Name}</strong></a> <br />
                    {candidate.CurrentJobTitle} <br />
                    {candidate.Location}
                </div>
            </foreignobject>
        );
    }
});

module.exports = CandidateTooltip;

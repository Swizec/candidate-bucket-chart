
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

const CandidateTooltip = require('./CandidateTooltip');

var Candidate = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {tooltip_shown: false,
                width: 12,
                height: 12,
                y_offset: 0,
                x_offset: 0};
    },

    toggle_tooltip: function () {
        if (this.state.tooltip_shown) {
            this.hide_tooltip();
        }else{
            this.show_tooltip();
        }
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

    componentDidMount: function () {
        d3.select(this.getDOMNode())
          .datum({id: "candidate-"+this.props.data.Candidate.Nid});
    },

    render: function () {
        var className = [
            "candidate",
            this.props.data.Candidate.Gender.toLowerCase(),
            this.props.passed ? "passed" : "no-passed"
        ].join(" ");

        return (
            <g transform={"translate("+(this.props.x+this.state.x_offset)+", "+(this.props.y+this.state.y_offset)+")"}
               onClick={this.toggle_tooltip}
               className={className}
               id={"candidate-"+this.props.data.Candidate.Nid}>
                <circle cx={this.props.r/2-this.state.x_offset}
                        cy={this.props.r/2-this.state.y_offset}
                        r={this.props.r}
                        />
                <CandidateTooltip
                        shown={this.state.tooltip_shown}
                        tellSize={this.fixSize}
                        {... this.props} />
            </g>
        );
    }
});

module.exports = Candidate;

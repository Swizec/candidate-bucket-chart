
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

const CandidateTooltip = require('./CandidateTooltip'),
      Icon = require('./Icon');

var Candidate = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {width: 12,
                height: 12,
                y_offset: 0,
                x_offset: 0};
    },

    toggle_tooltip: function () {
        this.props.toggle_tooltip(this.props.data.id);
    },

    componentDidMount: function () {
        d3.select(this.getDOMNode())
          .datum({id: "candidate-"+this.props.data.id});
    },

    beyondEdge: function () {
        return this.props.x > this.props.maxX
            || this.props.x < this.props.minX
            || this.props.y > this.props.maxY
            || this.props.y < this.props.minY;
    },

    render: function () {
        var gender = this.props.data.Candidate.Gender;
        gender = gender ? gender.toLowerCase() : "none";


        var className = [
            "candidate",
            gender,
            this.props.passed ? "passed" : "no-passed"
        ].join(" ");

        if (this.beyondEdge()) {
            return null;
        }

        return (
            <g transform={"translate("+(this.props.x+this.state.x_offset)+", "+(this.props.y+this.state.y_offset)+")"}
               onClick={this.toggle_tooltip}
               className={className}
               id={"candidate-"+this.props.data.id}>
                <Icon cx={this.props.r/2-this.state.x_offset}
                      cy={this.props.r/2-this.state.y_offset}
                      r={this.props.r/this.props.max_r}
                      gender={gender}
                      />
            </g>
        );
    }
});

module.exports = Candidate;

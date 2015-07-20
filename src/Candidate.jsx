
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

const CandidateTooltip = require('./CandidateTooltip'),
      Icon = require('./Icon');

var Candidate = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {width: 12,
                height: 19,
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
        return this.props.x+this.state.width/2 > this.props.maxX
            || this.props.x-this.state.width/2 < this.props.minX
            || this.props.y+this.state.height/2 > this.props.maxY
            || this.props.y-this.state.height/2 < this.props.minY;
    },

    getDimensions: function (width, height) {
        this.setState({width: width,
                       height: height});
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
                <Icon cx={this.state.x_offset}
                      cy={this.state.y_offset}
                      r={this.props.r/this.props.max_r}
                      gender={gender}
                      tellDimensions={this.getDimensions}
                      />
            </g>
        );
    }
});

module.exports = Candidate;


const React = require('react'),
      _ = require('lodash');

const Stars = require('./Stars');

var CandidateTooltip = React.createClass({
    getDefaultProps: function () {
        return {
            width: 300,
            height: 120,
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

        if (props.x+props.width > props.maxX) {
            x_offset  = -props.width;
        }
        if (props.y+props.height > props.maxY) {
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

    componentWillUpdate: function (props) {
        if (props.shown) {
            var svg = this.getDOMNode().parentNode.parentNode,
                top_id = this.getDOMNode().id.replace(/tooltip/, "candidate");

            // sort this candidate on top of others
            d3.select(svg)
              .selectAll("g.candidate")
              .sort(function (a, b) {
                  if (a.id === top_id) {
                      return +1;
                  }else if (b.id === top_id) {
                      return -1;
                  }else{
                      return 0;
                  }
              });

            // sort passline under this candidate
            // but implicitly on top of others
            d3.select(svg)
              .selectAll("g.pass-line, g#"+top_id)
              .sort(function (a, b) {
                  if (!a) return -1;
                  if (!b) return 1;
                  return 0;
              });
        }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return _.any([nextProps.width !== this.props.width,
                      nextProps.height !== this.props.height,
                      nextProps.shown !== this.props.shown,
                      !_.isEqual(nextProps.data, this.props.data)]);

    },

    render: function () {
        var candidate = this.props.data.Candidate;

        return (
            <foreignobject className="candidate-tooltip"
                           x="0"
                           y="0"
                           width={this.props.width}
                           height={this.props.height}
                           style={{display: this.props.shown ? "block" : "none"}}
                           id={"tooltip-"+this.props.data.id}>
                <div>
                    <img src={candidate.Photo} />
                    <div className="info">
                        <a href="#"><strong>{candidate.Name}</strong></a> <br />
                        {candidate.CurrentJobTitle} <br />
                        From <em>{candidate.Location}</em><br />
                    </div>
                    <Stars score={this.props.data.StarRating} />
                    <strong className="score">{this.props.data.OverallScore}</strong>
                </div>
            </foreignobject>
        );
    }
});

module.exports = CandidateTooltip;

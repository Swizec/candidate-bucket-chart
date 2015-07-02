
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
        this.setState({shown: this.props.shown});
    },

    componentWillReceiveProps: function (props) {
        this.calc_offsets(props);
        this.setState({shown: props.shown});
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

        this.setState({x_offset: x_offset,
                       y_offset: y_offset});
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return _.any([nextProps.width !== this.props.width,
                      nextProps.height !== this.props.height,
                      nextState.shown !== this.state.shown,
                      !_.isEqual(nextProps.data, this.props.data)]);

    },

    toggle: function () {
        this.setState({shown: !this.state.shown});
    },

    hide: function () {
        this.setState({shown: false});
    },

    //style={{display: this.state.shown ? "block" : "none"}}

    render: function () {
        var candidate = this.props.data.Candidate,
            x = this.props.x+this.state.x_offset,
            y = this.props.y+this.state.y_offset,
            transform = "translate("+x+","+y+")";

        return (
            <g transform={transform}
               style={{visibility: this.state.shown ? "visible" : "hidden"}}>
                <foreignobject className="candidate-tooltip"
                               width={this.props.width}
                               height={this.props.height}
                               id={"tooltip-"+this.props.data.id}>
                    <div>
                        <img src={candidate.Photo} />
                        <div className="info">
                            <strong><a href={"/node/"+candidate.nid}>{candidate.Name}</a></strong><br />
                            {candidate.currentJobTitle} <br />
                            From <em>{candidate.Location}</em><br />
                        </div>
                        <Stars score={this.props.data.StarRating} />
                        <strong className="score">{this.props.data.OverallScore}</strong>
                    </div>
                </foreignobject>
            </g>
        );
    }
});

module.exports = CandidateTooltip;

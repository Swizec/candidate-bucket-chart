
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

var PassLine = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {
            isDragging: false,
            y: 50,
            height: 10
        };
    },

    componentWillMount: function () {
        this.setState({y: this.props.initialY});
    },

    startDrag: function (event) {
        this.setState({
            isDragging: true,
            height: 50
        });
    },

    drag: function (event) {
        if (!this.state.isDragging
         || this.state.y < this.props.minY && event.clientY < this.state.y
         || this.state.y > this.props.maxY && event.clientY > this.state.y) {
            return;
        }

        var y = event.clientY;

        this.setState({
            y: y
        });

        if (this.props.updatePass) {
            this.props.updatePass(y);
        }
    },

    stopDrag: function () {
        this.setState({
            isDragging: false,
            height: 10
        });
    },

    render: function () {
        return (
            <g onMouseDown={this.startDrag}
               onMouseMove={this.drag}
               onMouseUp={this.stopDrag}>

                <rect x="0"
                      y={this.state.y-this.state.height/2}
                      width="100%"
                      height={this.state.height}
                      style={{fill: "white"}} />

                <line x1="0" y1={this.state.y-1}
                      x2="100%" y2={this.state.y-1}
                      style={{stroke: "black", strokeWidth: 1.5, opacity: .5}} />

            <text x="100%" y={this.state.y-4} textAnchor="end" style={{userSelect: "none"}}>
                {"Score: "+this.props.passValue}
            </text>
            </g>
        );
    }
});

module.exports = PassLine;


const React = require('react'),
      d3 = require('d3');

var PassLine = React.createClass({
    getInitialState: function () {
        return {
            isDragging: false,
            y: 50,
            height: 4
        };
    },

    componentWillMount: function () {
        this.setState({y: this.props.y || this.state.y});
    },

    componentWillReceiveProps: function (props) {
        this.setState({y: props.y});
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

        this.setState({
            y: event.clientY
        });
    },

    stopDrag: function () {
        this.setState({
            isDragging: false,
            height: 4
        });
    },

    render: function () {
        var y = this.state.y-this.state.height/2,
            transform = "translate(0, "+y+")";

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
            </g>
        );
    }
});

module.exports = PassLine;

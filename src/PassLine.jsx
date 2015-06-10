
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
            prev_y: event.clientY,
            height: this.props.maxY/2
        });
    },

    drag: function (event) {
        if (!this.state.isDragging
         || this.state.y < this.props.minY && event.clientY < this.state.y
         || this.state.y > this.props.maxY && event.clientY > this.state.y) {
            return;
        }

        var dy = event.clientY - this.state.prev_y,
            y = this.state.y + dy;

        this.setState({
            y: y,
            prev_y: event.clientY
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
               onMouseUp={this.stopDrag}
               onMouseOut={this.stopDrag}
               style={{cursor: "ns-resize"}}>

                <line x1={this.props.margin.left} y1={this.state.y-1}
                      x2="100%" y2={this.state.y-1}
                      style={{stroke: "black", strokeWidth: 1.5, opacity: .8}} />

            <text x="100%" y={this.state.y-4} textAnchor="end"
                  transform="translate(-22, 0)">
                    Score:
                </text>

                <text x="100%" y={this.state.y-4} textAnchor="end" className="text-big">
                    {this.props.passValue}
                </text>

                <rect x="0"
                      y={this.state.y-this.state.height/2}
                      width="100%"
                      height={this.state.height}
                      style={{fill: "rgba(0, 0, 0, 0)"}} />

            </g>
        );
    }
});

module.exports = PassLine;

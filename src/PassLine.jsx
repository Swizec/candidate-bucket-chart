
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
        this.setState({y: this.props.y});
    },

    componentWillReceiveProps: function (props) {
        this.setState({y: props.y});
    },

    startDrag: function (event) {
        event.stopPropagation();

        this.setState({
            isDragging: true,
            prev_y: event.clientY,
            height: this.props.maxY/2
        });
    },

    drag: function (event) {
        event.stopPropagation();

        if (!this.state.isDragging) return;

        var dy = event.clientY - this.state.prev_y,
            y = this.state.y + dy;

        if (y < this.props.minY) {
            y = this.props.minY;
        }else if (y > this.props.maxY) {
            y = this.props.maxY;
        }

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
        let text_x = "100%";

        if (this.state.y < 133 || this.state.y > this.props.maxY-113) {
            text_x = this.props.width-40;
        }

        return (
            <g onMouseDown={this.startDrag}
               onMouseMove={this.drag}
               onMouseUp={this.stopDrag}
               onMouseOut={this.stopDrag}
               style={{cursor: "ns-resize"}}
               className="pass-line">

                <line x1={this.props.margin.left} y1={this.state.y-1}
                      x2="100%" y2={this.state.y-1}
                      style={{stroke: "black", strokeWidth: 1.5, opacity: .8}} />

                <text x={text_x} y={this.state.y-4} textAnchor="end"
                      transform="translate(-22, 0)">
                    Score:
                </text>

                <text x={text_x} y={this.state.y-4} textAnchor="end" className="text-big">
                    {Math.round(this.props.passValue)}
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


const React = require('react'),
      d3 = require('d3'),
      DragSource = require('react-dnd').DragSource;

/**
 * Implements the drag source contract.
 */
var cardSource = {
  beginDrag: function (props) {
    return {
      text: props.text
    };
  }
}

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

var PassLine = React.createClass({
    render: function () {
        var connectDragSource = this.props.connectDragSource;

        return connectDragSource(
            <rect x="0" y="50" width="100%" height="5" style={{opacity: .4}} />
        );
    }
});

module.exports = DragSource("CARD", cardSource, collect)(PassLine);

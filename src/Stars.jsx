
const React = require('react'),
      _ = require('lodash');

var Stars = React.createClass({
    render: function () {
        return (
            <div>
            {_.range(10).map(function (i) {
                var icon = "";

                if (i > this.props.score) {
                    icon = "glyphicon-star-empty";
                }else{
                    icon = "glyphicon-star";
                }

                return (
                    <span className={"glyphicon "+icon}
                          key={"star-"+i}></span>
                )
            }.bind(this))}
            </div>
        );
    }
});

module.exports = Stars;


const React = require('react');

const BucketCounts = React.createClass({
    render: function () {
        var Npassed = this.props.data.Responses.filter(
            function (d) {
                return this.props.y_value(d) > this.props.passValue;
            }.bind(this)).length,

            Nfail = this.props.data.Responses.length - Npassed;

        var lineY = this.props.lineY;

        return (
            <g className="bucket-sizes">
                <text textAnchor="center"
                      transform={"rotate(90) translate("+(lineY/2)+", "+(-this.props.width+50)+")"}
                      className="pass">

                    {Npassed}
                </text>

                <text textAnchor="center"
                      transform={"rotate(90) translate("+(lineY+(this.props.height-lineY)/2)+", "+(-this.props.width+60)+")"}
                      className="no-pass">
                    {Nfail}
                </text>
            </g>
        );
    }
});

module.exports = BucketCounts;

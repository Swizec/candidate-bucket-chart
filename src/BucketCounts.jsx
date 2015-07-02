
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
                <g transform={"rotate(90) translate("+(lineY/2)+", "+(-this.props.width+this.props.margin.right-30)+")"}>
                    <text textAnchor="center"
                          className="pass">
                        {Npassed}
                    </text>
                    <text textAnchor="center"
                          y="18"
                          x="-30"
                          className="pass">
                        candidates
                    </text>
                </g>

                <g transform={"rotate(90) translate("+(lineY+(this.props.height-lineY)/2)+", "+(-this.props.width+this.props.margin.right-30)+")"}>
                    <text textAnchor="center"
                          className="no-pass">
                        {Nfail}
                    </text>
                    <text textAnchor="center"
                          y="18"
                          x="-30"
                          className="no-pass">
                        candidates
                    </text>
                </g>
            </g>
        );
    }
});

module.exports = BucketCounts;

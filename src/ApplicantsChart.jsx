
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

const BubbleChart = require('./BubbleChart');

const Error = React.createClass({
    render: function () {
        return (
            <div className="alert alert-danger" role="alert">
                Error: {this.props.error.message}
            </div>
        );
    }
});

const Loading = React.createClass({
    render: function () {
        return (
            <div>Loading data ...</div>
        );
    }
});

const ApplicantsChart = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {};
    },

    getDefaultProps: function () {
        return {
            width: 800,
            height: 300
        };
    },

    componentDidMount: function () {
        d3.json(this.props.url, function (error, data) {
            if (error) {
                this.setState({error: new URIError(error.responseText)});
            }else{
                this.setState({data: data[0]});
            }
        }.bind(this));
    },

    render: function () {
        if (this.state.error) {
            return (<Error error={this.state.error} />);
        }else if (this.state.data) {
            return (<BubbleChart data={this.state.data} {... this.props} />);
        }else {
            return (<Loading />);
        }
    }
});

module.exports = ApplicantsChart;

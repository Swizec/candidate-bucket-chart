
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

const BubbleChart = require('./BubbleChart'),
      Filters = require('./Filters');

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
            height: 500,
            max_r: 10
        };
    },

    componentDidMount: function () {
        d3.json(this.props.url, function (error, data) {
            if (error) {
                this.setState({error: new URIError(error.responseText)});
            }else{
                this.setState({data: data,
                               filter: function (d) {
                                   return d[0]
                               }});
            }
        }.bind(this));
    },

    updateFilter: function (filter) {
        this.setState({filter: filter});
    },

    render: function () {
        if (this.state.error) {
            return (<Error error={this.state.error} />);
        }else if (this.state.data) {
            var filtered_data = this.state.filter(this.state.data);

            return (
                <div className="applicants-chart">
                    <h2>{filtered_data.JobTitle} <small>{filtered_data.Responses.length} candidates</small></h2>
                    <BubbleChart data={filtered_data} {... this.props} />
                    <Filters updateFilter={this.updateFilter} data={this.state.data} />
                </div>
            );
        }else {
            return (<Loading />);
        }
    }
});

module.exports = ApplicantsChart;

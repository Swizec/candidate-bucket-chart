
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

const BubbleChart = require('./BubbleChart'),
      Filters = require('./Filters');

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
    /* componentDidMount: function () {
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
       }, */

    /* updateFilter: function (filter) {
       this.setState({filter: filter});
       }, */

    updateData: function (data) {
        this.setState({data: data});
    },

    render: function () {
        if (!this.state.data) {
            return (
                <Filters urlRoot={this.props.urlRoot} />
            );
        }else if (this.state.data) {
            return (
                <div className="applicants-chart">
                    <h2>{data.JobTitle} <small>{_.size(data.Responses)} candidates</small></h2>
                    <BubbleChart data={filtered_data} {... this.props} />
                    <Filters urlRoot={this.props.urlRoot} />
                </div>
            );
        }else {
            return (<Loading />);
        }
    }
});

module.exports = ApplicantsChart;

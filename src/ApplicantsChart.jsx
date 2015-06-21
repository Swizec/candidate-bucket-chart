
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

    updateData: function (data) {
        this.setState({data: data});
    },

    render: function () {
        if (!this.state.data) {
            return (
                <Filters urlRoot={this.props.urlRoot}
                         returnData={this.updateData} />
            );
        }else if (this.state.data) {
            let data = this.state.data;

            return (
                <div className="applicants-chart">
                    <h2>{data.JobTitle} <small>{_.size(data.Responses)} candidates</small></h2>
                    <BubbleChart data={data} {... this.props} />
                    <Filters urlRoot={this.props.urlRoot}
                             returnData={this.updateData} />
                </div>
            );
        }else {
            return (<Loading />);
        }
    }
});

module.exports = ApplicantsChart;

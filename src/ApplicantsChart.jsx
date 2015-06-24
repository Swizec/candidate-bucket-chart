
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      d3 = require('d3');

const BubbleChart = require('./BubbleChart'),
      Filters = require('./Filters/');

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

    updateData: function (data, N_all) {
        this.setState({data: data,
                       N_all: N_all});
    },

    render: function () {
        let chart = null,
            data = this.state.data;

        if (data) {
            chart = (
                <div>
                    <h2>{data.JobTitle} <small>{_.size(data.Responses)}/{this.state.N_all} candidates</small></h2>
                    <BubbleChart data={data} {... this.props} />
                </div>
            );
        }

        return (
            <div className="applicants-chart">
                {chart}
                <Filters urlRoot={this.props.urlRoot}
                         returnData={this.updateData} />
            </div>
        );
    }
});

module.exports = ApplicantsChart;

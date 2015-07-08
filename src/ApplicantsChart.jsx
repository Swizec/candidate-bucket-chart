
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

    updateData: function (data, N_all, caption) {
        this.setState({data: data,
                       N_all: N_all,
                       caption: caption});
    },

    updatePassValue: function (value, N_above, N_below) {
        this.setState({passValue: value,
                       N_above: N_above,
                       N_below: N_below});
    },

    render: function () {
        let chart = null,
            data = this.state.data,
            moreInfo = null;

        if (data) {
            let flatData = data.reduce(function (mem, d) {
                return mem.concat(d.Responses);
            }, []);

            chart = (
                <div>
                    <h2>{this.state.caption} <small>{flatData.length}/{this.state.N_all} candidates</small></h2>
                    <BubbleChart data={flatData}
                                 updatePassValue={this.updatePassValue}
                                 {... this.props} />
                </div>
            );

            moreInfo = (
                <div className="metaData">
                    <p>Total candidates: <b>{this.state.N_all}</b></p>
                    <p>Candidates matching criteria: <b>{flatData.length}</b></p>
                    <p>Score line: <b>{this.state.passValue}</b></p>
                    <p>Above the line: <b>{this.state.N_above}</b> candidates</p>
                    <p>Below the line: <b>{this.state.N_below}</b> candidates</p>
                </div>
            );
        }

        return (
            <div className="applicants-chart">
                {chart}
                <Filters urlRoot={this.props.urlRoot}
                         returnData={this.updateData} />
                {moreInfo}
            </div>
        );
    }
});

module.exports = ApplicantsChart;

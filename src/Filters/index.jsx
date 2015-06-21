
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const Error = require('./Error'),
      Loading = require('./Loading'),
      Dropdown = require('./Dropdown'),
      SubFilters = require('./SubFilters');

const Filters = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {loading: true};
    },

    componentDidMount: function () {
        this.fetchBusinessAccounts();
    },

    __fetch: function (url, callback) {
        this.setState({loading: true});

        d3.json(this.props.urlRoot+url+".json", function (error, data) {
            if (error) {
                this.setState({error: new URIError(error.responseText),
                               loading: false});
            }else{
                this.setState({error: null,
                               loading: false});
                callback(data);
            }
        }.bind(this));
    },

    fetchBusinessAccounts: function () {
        this.__fetch("reports", function (data) {
            this.setState({
                selectedBA: null,
                business_accounts:
                [{value: "null",
                  label: "Pick account"}].concat(
                      data.map(function (d) {
                          return {value: d.nid,
                                  label: d.title};
                      }))
            });
        }.bind(this));
    },

    changeBusinessAccount: function (event) {
        let account_id = event.currentTarget.value;

        this.setState({selectedBA: account_id});

        if (account_id != "null") {
            this.fetchJobs(account_id);
        }else{
            this.setState({jobs: null});
        }
    },

    fetchJobs: function (account_id) {
        this.__fetch("reports/"+account_id, function (data) {
            this.setState({selectedJob: null,
                           jobs:
                           [{value: "null",
                             label: "Pick job"}].concat(
                                 data.map(function (d) {
                                     return {value: d.JobId,
                                             label: d.JobTitle};
                                 }))
            });
        }.bind(this));
    },

    changeJob: function (event) {
        let job_id = event.currentTarget.value;

        this.setState({selectedJob: job_id});

        if (job_id != "null") {
            this.fetchData(this.state.selectedBA, job_id);
        }else{
            this.setState({selectedJob: null});
        }
    },

    fetchData: function (account_id, job_id) {
        this.__fetch("reports/"+account_id+"/"+job_id, function (data) {
            data = data[0];
            if (!_.isArray(data.Responses)) {
                data.Responses = _.values(data.Responses)
                                  .map(function (d, i) {
                                      d.randomProp = Math.random();
                                      d.id = i;
                                      return d;
                                  });
            }

            this.setState({data: data});
        }.bind(this));
    },

    updateFilter: function (func) {
        this.setState({filter: func});
    },

    componentDidUpdate: function () {
        if (!this.state.selectedBA || !this.state.selectedJob) {
            this.props.returnData(null);
        }else{
            if (this.state.data) {
                let data = _.cloneDeep(this.state.data);
                data.Responses = data.Responses.filter(this.state.filter
                                                     || function () { return true; });

                this.props.returnData(data);
            }
        }
    },

    render: function () {
        let status = null,
            BA_dropdown = null,
            jobs_dropdown = null,
            help = null,
            subfilters = null;

        if (this.state.loading) {
            status = (
                <Loading />
            );
        }else if (this.state.error) {
            status = (
                <Error error={this.state.error} />
            );
        }

        if (this.state.business_accounts) {
            BA_dropdown = (
                <Dropdown options={this.state.business_accounts}
                          onChange={this.changeBusinessAccount}
                          label="Business Account"
                          name="BA"
                          selected={this.state.selectedBA} />
            );
        }

        if (this.state.jobs) {
            jobs_dropdown = (
                <Dropdown options={this.state.jobs}
                          onChange={this.changeJob}
                          label="Job"
                          name="job"
                          selected={this.state.selectedJob} />
            );
        }

        if (this.state.data) {
            subfilters = (
                <SubFilters updateFilter={this.updateFilter}
                            data={this.state.data} />
            );
        }

        if (!this.state.selectedBA || !this.state.selectedJob) {
            help = (
                <h2>Pick a business account and a job to see candidates</h2>
            );
        }

        return (
            <div>
                {help}
                {status}
                <form className="form-inline">
                    {BA_dropdown}
                    {jobs_dropdown}
                    {subfilters}
                </form>
            </div>
        );
    }
});

module.exports = Filters;


const React = require('react');

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

const Dropdown = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label htmlFor={"dropdown-"+this.props.name}>{this.props.label}: </label>
                <select name={this.props.name} id={"dropdown-"+this.props.name}
                        onChange={this.props.onChange}
                        value={this.props.selected}>
                    {this.props.options.map(function (option) {
                        return (
                            <option value={option.value}
                                    key={"option-"+this.props.name+"-"+option.value}>
                            {option.label}
                            </option>
                        );
                     }.bind(this))}
                </select>
            </div>
        );
    }
});

const Filters = React.createClass({
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
                data.Responses = _.values(data.Responses);
            }

            this.setState({data: data});
        }.bind(this));
    },

    componentWillUpdate: function (nextProps, nextState) {
        if (!nextState.selectedBA || !nextState.selectedJob) {
            this.props.returnData(null);
        }else{
            this.props.returnData(nextState.data);
        }
    },

    render: function () {
        let status = null,
            BA_dropdown = null,
            jobs_dropdown = null,
            help = null

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
                </form>
            </div>
        );
    }
});

module.exports = Filters;

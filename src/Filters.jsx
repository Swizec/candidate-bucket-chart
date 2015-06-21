
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

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

const SubFilters = React.createClass({
    //mixins: [PureRenderMixin],

    getInitialState: function () {
        return {selected: {education: null,
                           gender: null},
                filters: {education: function (d) { return true; },
                          gender: function (d) { return true; }}};
    },

    get_educations: function () {
        var job = this.state.selected.job,
            data = this.props.data.Responses;

        return [{value: "__reset_filter__",
                 label: "All"}].concat(
                     _.uniq(data,
                            function (d) { return d.Candidate.EducationLevel; }
                     )
                      .map(function (d) {
                          return {value: d.Candidate.EducationLevel,
                                  label: d.Candidate.EducationLevel};
                      }));
    },

    picked_education: function () {
        var education = event.target.value,
            filter;

        if (education != null && education != "__reset_filter__") {
            filter = function (d) {
                return d.Candidate.EducationLevel == education;
            };
        }else{
            filter = function () { return true; };
        }

        var selected = this.state.selected,
            filters = this.state.filters;

        selected.education = education;
        filters.education = filter;

        this.setState({selected: selected,
                       filters: filters});
        this.updateFilters();
    },

    get_genders: function () {
        var job = this.state.selected.job,
            data = this.props.data.Responses;

        return [{value: "__reset_filter__",
                 label: "All"}].concat(
                     _.uniq(data,
                            function (d) { return d.Candidate.Gender; }
                     )
                      .map(function (d) {
                          return {value: d.Candidate.Gender,
                                  label: d.Candidate.Gender};
                      }));
    },

    picked_gender: function () {
        var gender = event.target.value,
            filter;

        if (gender != null && gender != "__reset_filter__") {
            filter = function (d) { return d.Candidate.Gender == gender; };
        }else{
            filter = function () { return true; };
        }

        var selected = this.state.selected,
            filters = this.state.filters;

        selected.gender = gender;
        filters.gender = filter;

        this.setState({selected: selected,
                       filters: filters});
        this.updateFilters();
    },

    updateFilters: function () {
        var education = this.state.filters.education,
            gender = this.state.filters.gender;

        this.props.updateFilter(function (d) {
            return _.all([education(d),
                          gender(d)]);
        }.bind(this));
    },

    render: function () {
        return (
            <div className="form-group">
                    <Dropdown options={this.get_educations()}
                              onChange={this.picked_education}
                              label="Education level"
                              name="education"
                              selected={this.state.selected.education} />

                    <Dropdown options={this.get_genders()}
                              onChange={this.picked_gender}
                              label="Gender"
                              name="gender"
                              selected={this.state.selected.gender} />
            </div>
        );
    }
});

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

    componentWillUpdate: function (nextProps, nextState) {
        if (!nextState.selectedBA || !nextState.selectedJob) {
            this.props.returnData(null);
        }else{
            if (nextState.data) {
                let data = _.cloneDeep(nextState.data);
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

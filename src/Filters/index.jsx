
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const Error = require('./Error'),
      Loading = require('./Loading'),
      Dropdown = require('./Dropdown'),
      SubFilters = require('./SubFilters');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const Filters = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {loading: true,
                types: [{value: "null",
                         label: "Pick type"},
                        {value: "client",
                         label: "Client"},
                        {value: "job",
                         label: "Job"}]};
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

        if (account_id == "null") {
            account_id = null;
        }

        this.setState({selectedBA: account_id,
                       selectedType: null,
                       selectedJob: null,
                       jobs: null,
                       data: null});
    },

    changeType: function (event) {
        let type = event.currentTarget.value;

        if (type == "null") {
            type = null;
        }

        this.setState({selectedType: type,
                       selectedJob: null,
                       jobs: null,
                       data: null});

        if (type != "null") {
            this.fetchList(type);
        }
    },

    fetchList: function (type) {
        let account_id = this.state.selectedBA,
            label = type == "job" ? "Pick job" : "Pick client";

        this.__fetch("reports/"+account_id+"/"+type, function (data) {
            this.setState({selectedJob: null,
                           jobs:
                           [{value: "null",
                             label: label}].concat(
                                 data.map(function (d) {
                                     return {value: d.nid,
                                             label: d.title};
                                 }))
            });
        }.bind(this));
    },

    changeJob: function (event) {
        let job_id = event.currentTarget.value;

        if (job_id == "null") {
            job_id = null;
        }

        this.setState({selectedJob: job_id,
                       data: null});

        if (job_id != "null") {
            this.fetchData(job_id);
        }else{
            this.setState({selectedJob: null});
        }
    },

    fetchData: function (job_id) {
        let account_id = this.state.selectedBA,
            type = this.state.selectedType;

        this.__fetch(["reports", account_id, type, job_id].join("/"), function (data) {
            data = data.map(function (data, j) {
                if (!_.isArray(data.Responses)) {
                    data.Responses = _.values(data.Responses);
                }
                data.Responses = data.Responses.map(function (d, i) {
                    d.randomProp = Math.random();
                    d.id = i+'-'+j;
                    return d;
                });
                return data;
            }, this);

            let flatData = data.reduce(function (mem, d) {
                return mem.concat(d.Responses);
            }, []);

            this.setState({data: data,
                           flatData: flatData});
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
                let N_all = 0,
                    data = _.cloneDeep(this.state.data)
                            .map(function (data) {
                                N_all += data.Responses.length;
                                data.Responses = data.Responses.filter(
                                    this.state.filter
                                 || function () { return true; }
                                );

                                return data;
                            }, this),
                    caption = _.find(
                        this.state.jobs,
                        function (d) { return d.value == this.state.selectedJob},
                        this
                    ).label;

                this.props.returnData(data, N_all, caption);
            }
        }
    },

    render: function () {
        let status = null,
            BA_dropdown = null,
            types_dropdown = null,
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

        if (this.state.selectedBA) {
            types_dropdown = (
                <Dropdown options={this.state.types}
                          onChange={this.changeType}
                          label="Chart type"
                          name="type"
                          selected={this.state.selectedType} />
            );
        }

        if (this.state.jobs) {
            jobs_dropdown = (
                <Dropdown options={this.state.jobs}
                          onChange={this.changeJob}
                          label={capitalizeFirstLetter(this.state.selectedType)}
                          name="job"
                          selected={this.state.selectedJob} />
            );
        }

        if (this.state.data) {
            subfilters = (
                <SubFilters updateFilter={this.updateFilter}
                            data={this.state.flatData} />
            );
        }

        if (!this.state.selectedBA || !this.state.selectedJob) {
            if (!this.state.selectedType) {
                help = (
                    <h2>Pick a business account and a chart type to see candidates</h2>
                );
            }else{
                help = (
                    <h2>Pick a business account and a {this.state.selectedType} to see candidates</h2>
                );
            }
        }

        return (
            <div>
                {help}
                {status}
                <form className="form-inline">
                    {BA_dropdown}
                    {types_dropdown}
                    {jobs_dropdown}
                    {subfilters}
                </form>
            </div>
        );
    }
});

module.exports = Filters;

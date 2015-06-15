
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Filters = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        var job_id = this.props.data[0].JobId;
        return {selected: {job: job_id,
                           education: null,
                           gender: null},
                filters: {job: function (d) {
                    return d.JobId == job_id;
                },
                          education: function (d) { return true; },
                          gender: function (d) { return true; }}};
    },

    get_jobs: function () {
        return this.props.data.map(function (d) {
            return {value: d.JobId,
                    label: d.JobTitle};
        });
    },

    picked_job: function () {
        var job_id = event.target.value,
            selected = this.state.selected,
            filters = this.state.filters;

        selected.job = job_id;
        filters.job = function (d) { return d.JobId == job_id; };

        this.setState({selected: selected,
                       filters: filters});

        this.updateFilters();
    },

    get_educations: function () {
        var job = this.state.selected.job,
            data = this.props.data.filter(this.state.filters.job)[0].Responses;

        return [{value: null,
                 label: "All"}].concat(data.map(function (d) {
                     return {value: d.Candidate.EducationLevel,
                             label: d.Candidate.EducationLevel};
                 }));
    },

    picked_education: function () {
        var education = event.target.value,
            filter;

        if (education != null) {
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
            data = this.props.data.filter(this.state.filters.job)[0].Responses;

        return [{value: null,
                 label: "All"}].concat(data.map(function (d) {
                     return {value: d.Candidate.Gender,
                             label: d.Candidate.Gender};
                 }));
    },

    picked_gender: function () {
        var gender = event.target.value,
            filter;

        if (gender != null ) {
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
        var job = this.state.filters.job,
            education = this.state.filters.education,
            gender = this.state.filters.gender;

        this.props.updateFilter(function (d) {
            var data = d.filter(job)[0];

            data.Responses = data.Responses
                                 .filter(education)
                                 .filter(gender);

            return data;
        });
    },

    render: function () {
        return (
            <div>
                <form className="form-inline">
                    <Dropdown options={this.get_jobs()}
                              onChange={this.picked_job}
                              label="Job"
                              name="job"
                              selected={this.state.selected.job} />

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
                </form>
            </div>
        );
    }
});

var Dropdown = React.createClass({
    render: function () {
        return (
            <div className="form-group">
                <label htmlFor={"dropdown-"+this.props.name}>{this.props.label}: </label>
                <select name={this.props.name} id={"dropdown-"+this.props.name}
                        onChange={this.props.onChange}>
                    {this.props.options.map(function (option) {
                        var selected = this.props.selected == option.value
                                                            ? "selected"
                                                            : "";
                        return (
                            <option value={option.value}
                                    key={"option-"+this.props.name+"-"+option.value}
                                    selected={selected}>
                            {option.label}
                            </option>
                        );
                     }.bind(this))}
                </select>
            </div>
        );
    }
});

module.exports = Filters;

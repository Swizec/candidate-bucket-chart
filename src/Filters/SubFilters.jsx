

const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const Dropdown = require('./Dropdown');

const SubFilters = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {education: null,
                gender: null,
                filters: {education: function (d) { return true; },
                          gender: function (d) { return true; }}};
    },

    get_educations: function () {
        var data = this.props.data.Responses;

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

        if (!education) {
            filter = function (d) { return !d.Candidate.EducationLevel; }
        }else if (education != "__reset_filter__") {
            filter = function (d) {
                return d.Candidate.EducationLevel == education;
            };
        }else{
            filter = function () { return true; };
        }

        var filters = this.state.filters;
        filters.education = filter;

        this.setState({education: education,
                       filters: filters});
    },

    get_genders: function () {
        var data = this.props.data.Responses;

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

        if (!gender) {
            filter = function (d) { return !d.Candidate.Gender; };
        }else if (gender != "__reset_filter__") {
            filter = function (d) { return d.Candidate.Gender == gender; };
        }else{
            filter = function () { return true; };
        }

        var filters = this.state.filters;
        filters.gender = filter;

        this.setState({gender: gender,
                       filters: filters});
    },

    componentWillUpdate: function (nextProps, nextState) {
        var education = nextState.filters.education,
            gender = nextState.filters.gender;

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
                              selected={this.state.education} />

                    <Dropdown options={this.get_genders()}
                              onChange={this.picked_gender}
                              label="Gender"
                              name="gender"
                              selected={this.state.gender} />
            </div>
        );
    }
});

module.exports = SubFilters;

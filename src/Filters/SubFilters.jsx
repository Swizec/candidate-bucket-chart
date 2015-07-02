

const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const Dropdown = require('./Dropdown');

const SubFilters = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {education: null,
                gender: null,
                filters: {education: function (d) { return true; },
                          gender: function (d) { return true; },
                          source: function (d) { return true; }}};
    },

    get_values: function (field) {
        var data = this.props.data.Responses;

        return [{value: "__reset_filter__",
                 label: "All"}].concat(
                     _.uniq(data, function (d) { return d.Candidate[field]; })
                      .map(function (d) {
                          return {value: d.Candidate[field] || "null",
                                  label: d.Candidate[field] || "(empty)"};
                      }));
    },

    picked_education: function () {
        var education = event.target.value,
            filter;

        if (!education || education == "null") {
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

    picked_gender: function () {
        var gender = event.target.value,
            filter;

        if (!gender || gender == "null") {
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

    picked_source: function () {
        var source = event.target.value,
            filter;

        if (!source || source == "null") {
            filter = function (d) { return !d.Candidate.Source; };
        }else if (source != "__reset_filter__") {
            filter = function (d) { return d.Candidate.Source == source; };
        }else{
            filter = function () { return true; };
        }

        var filters = this.state.filters;
        filters.source = filter;

        this.setState({source: source,
                       filters: filters});
    },


    componentWillUpdate: function (nextProps, nextState) {
        var education = nextState.filters.education,
            gender = nextState.filters.gender,
            source = nextState.filters.source;

        this.props.updateFilter(function (d) {
            return _.all([education(d),
                          gender(d),
                          source(d)]);
        }.bind(this));
    },

    render: function () {
        return (
            <div className="form-group">
                    <Dropdown options={this.get_values('EducationLevel')}
                              onChange={this.picked_education}
                              label="Education level"
                              name="education"
                              selected={this.state.education} />

                    <Dropdown options={this.get_values('Gender')}
                              onChange={this.picked_gender}
                              label="Gender"
                              name="gender"
                              selected={this.state.gender} />

                    <Dropdown options={this.get_values('Source')}
                              onChange={this.picked_source}
                              label="Candidate Source"
                              name="serce"
                              selected={this.state.source} />
            </div>
        );
    }
});

module.exports = SubFilters;

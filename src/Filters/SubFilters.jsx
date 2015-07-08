

const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const Dropdown = require('./Dropdown');

const SubFilters = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {education: "__reset_filter__",
                gender: "__reset_filter__",
                source: "__reset_filter__",
                reviewer: "__reset_filter__",
                filters: {education: function (d) { return true; },
                          gender: function (d) { return true; },
                          source: function (d) { return true; },
                          reviewer: function (d) { return true; }}};
    },

    get_values: function (field) {
        var data = this.props.data;

        return [{value: "__reset_filter__",
                 label: "All"}].concat(
                     _.uniq(data, function (d) { return d.Candidate[field]; })
                      .map(function (d) {
                          return {value: d.Candidate[field] || "null",
                                  label: d.Candidate[field] || "(empty)"};
                      }));
    },


    picked_value: function (data_key, local_key, value) {
        var filter;

        if (!value || value == "null") {
            filter = function (d) { return !d.Candidate[data_key]; };
        }else if (value != "__reset_filter__") {
            filter = function (d) { return d.Candidate[data_key] == value; };
        }else{
            filter = function () { return true; };
        }

        var filters = this.state.filters;
        filters[local_key] = filter;

        var change = {filters: filters};
        change[local_key] = value;

        this.setState(change);
    },

    picked_education: function () {
        this.picked_value('EducationLevel', 'education', event.target.value);
    },

    picked_gender: function () {
        this.picked_value('Gender', 'gender', event.target.value);
    },

    picked_source: function () {
        this.picked_value('Source', 'source', event.target.value);
    },

    picked_reviewer: function () {
        this.picked_value('Reviewer', 'reviewer', event.target.value);
    },

    componentWillUpdate: function (nextProps, nextState) {
        var education = nextState.filters.education,
            gender = nextState.filters.gender,
            source = nextState.filters.source,
            reviewer = nextState.filters.reviewer;

        this.props.updateFilter(function (d) {
            return _.all([education(d),
                          gender(d),
                          source(d),
                          reviewer(d)]);
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
                              name="source"
                              selected={this.state.source} />

                    <Dropdown options={this.get_values('Reviewer')}
                              onChange={this.picked_reviewer}
                              label="Reviewer"
                              name="reviewer"
                              selected={this.state.reviewer} />

            </div>
        );
    }
});

module.exports = SubFilters;

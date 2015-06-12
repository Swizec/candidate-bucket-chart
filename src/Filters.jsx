
const React = require('react'),
      PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Filters = React.createClass({
    mixins: [PureRenderMixin],

    getInitialState: function () {
        return {selected: this.props.data[0].JobId};
    },

    get_jobs: function () {
        return this.props.data.map(function (d) {
            return {value: d.JobId,
                    label: d.JobTitle};
        });
    },

    picked_job: function () {
        var job_id = event.target.value;

        this.setState({selected: job_id});
        this.props.updateFilter(function (d) {
            return d.JobId == job_id;
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
                              selected={this.state.selected} />
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

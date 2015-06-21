
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
        d3.json(this.props.urlRoot+"reports.json", function (error, data) {
            if (error) {
                this.setState({error: new URIError(error.responseText),
                               loading: false});
            }else{
                this.setState({loading: false,
                               business_accounts:
                               [{value: null,
                                 label: "Pick account"}].concat(
                                     data.map(function (d) {
                                         return {value: d.nid,
                                                 label: d.title};
                                     }))});
            }
        }.bind(this));
    },

    render: function () {
        let status = null,
            BA_dropdown = null;

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
                          onChange={this.changeBA}
                          label="Business Account"
                          name="BA"
                          selected={this.state.selectedBA} />
            );
        }

        return (
            <div>
                {status}
                <form className="form-inline">
                    {BA_dropdown}
                </form>
            </div>
        );
    }
});

module.exports = Filters;

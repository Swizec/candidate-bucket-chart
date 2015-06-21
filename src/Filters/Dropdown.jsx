
const React = require('react');

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

module.exports = Dropdown;

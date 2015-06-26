
const React = require('react');

const Error = React.createClass({
    render: function () {
        console.error("API Error:");
        console.error("message:", this.props.error.message);
        console.error("object:", this.props.error);

        return (
            <div className="alert alert-danger" role="alert">
                Couldn't get data from server
            </div>
        );
    }
});

module.exports = Error;

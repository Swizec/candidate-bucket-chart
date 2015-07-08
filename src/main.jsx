
const React = require('react'),
      ApplicantsChart = require('./ApplicantsChart');

React.render(
    <ApplicantsChart urlRoot="rest/" />,
    document.querySelectorAll('.container')[0]
);


const React = require('react'),
      ApplicantsChart = require('./ApplicantsChart');

React.render(
    <ApplicantsChart urlRoot="data/" />,
    document.querySelectorAll('.container')[0]
);

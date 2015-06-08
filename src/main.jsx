
const React = require('react'),
      ApplicantsChart = require('./ApplicantsChart');

React.render(
    <ApplicantsChart url="bigscreen.json" />,
    document.querySelectorAll('.container')[0]
);

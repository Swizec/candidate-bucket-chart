
const React = require('react'),
      ApplicantsChart = require('./ApplicantsChart');

React.render(
    <ApplicantsChart url="/__bigscreen.json" />,
    document.querySelectorAll('.container')[0]
);

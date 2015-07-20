
const React = require('react'),
      ApplicantsChart = require('./ApplicantsChart');

function RenderApplicantsChart(options) {
    React.render(
        <ApplicantsChart {... options} />,
        document.querySelectorAll(options.selector)[0]
    );
}

module.exports = RenderApplicantsChart;
window.RenderApplicantsChart = RenderApplicantsChart;

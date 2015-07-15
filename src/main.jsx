
const React = require('react'),
      ApplicantsChart = require('./ApplicantsChart');

function RenderApplicantsChart(urlRoot, selector) {
    React.render(
        <ApplicantsChart urlRoot={urlRoot} />,
        document.querySelectorAll(selector)[0]
    );
}

module.exports = RenderApplicantsChart;
window.RenderApplicantsChart = RenderApplicantsChart;

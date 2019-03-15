const report = require('multiple-cucumber-html-reporter');

report.generate({
  reportName:
    "<div style='height:91px;background: #004165;'><div style='display: inline-block; vertical-align: top; margin: 1.9em 0 0 .75em; color: #FFF; font-weight: 500; font-style: normal; font-size: 2rem; white-space: nowrap;'>Automation Report</div></div></div>",
  pageTitle: "Automation Report",
  pageFooter: " ",
  jsonDir: "reports",
  reportPath: "coverage",
  displayDuration: true,
  durationInMS: false,
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Automation POC" },
      { label: "Release", value: "Sprint - 1" },
      { label: "Squad", value: "WDCD - Automation" }
    ]
  }
});

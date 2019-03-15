'use strict';

const find = require('find');
const fs = require('fs-extra');
const jsonFile = require('jsonfile');
const path = require('path');

(function() {

  let files;
  const reportDir = "./reports/";
  try {
    files = find.fileSync(/\.json$/, path.resolve(process.cwd(), reportDir));
  } catch (e) {
    throw new Error(`There were issues reading JSON-files from '${reportDir}'.`);
  }

  if (files.length > 0) {
    files.map(file => {
      const jsonOutput = [];
      const browser = file.indexOf("firefox") !== -1 ? 'firefox' : 'chrome';
      const browserVersin =
        browser === "firefox"
          ? "65.0b13 (64-bit)"
          : "74.0.3723.0 (64-bit)";
      const data = fs.readFileSync(file).toString() || "[]";
      JSON.parse(data).map(json => {
        if (!json.metadata) {
          json = Object.assign(
            {
              metadata: {
                browser: {
                  name: browser,
                  version: browserVersin
                },
                device: process.platform.charAt(0).toUpperCase() + process.platform.slice(1), 
                platform: {
                  name: process.platform === 'darwin' ? 'osx' : process.platform,
                  version: process.arch
                }
              }
            },
            json
          );
        }
        jsonOutput.push(json)
      });
      const outFile = path.resolve('./reports/', file);
      fs.ensureDirSync('./reports');
      jsonFile.writeFileSync(outFile, jsonOutput, { spaces: 2 });
    });
  }
})();
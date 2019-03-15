# UI Automation

##### Table of Contents

<!-- toc -->

- [Overview](#overview)
- [Learn](#howto)
- [Setup](#setup)
- [Testing](#testing)
- [Ready?](#ready)

<!-- tocstop -->

### Overview

UI Automation Boilerplate Project - will be used to Test UI based projects through BDD Testing.

### Setup

> yarn install

### Testing

- To Run Automation

  - Single Thread

    - Exectue Automation in Chrome
      > npm run test:chrome
    - Exectue Automation in Firefox
      > npm run test:firefox
    - Execute Automation in Chrome & Firefox together
      > npm run test

  - Parallel (parallel thread can be updated in package.json, default is 3)

    - Parallel may not work in windows

    - Exectue Automation in Chrome
      > npm run test:parallel:chrome
    - Exectue Automation in Firefox
      > npm run test:parallel:firefox
    - Execute Automation in Chrome & Firefox together
      > npm run test:parallel

  - Specific Feature (usually to test specific feature on Development time)

    - Exectue Automation in Chrome
      > npm run test:feature:chrome `src/features/[feature-filename].feature`
    - Exectue Automation in Firefox
      > npm run test:feature:firefox `src/features/[feature-filename].feature`

  - Specific Scenario (usually to test specific scenario on Development time)

    - Exectue Automation in Chrome
      > npm run test:scenario:chrome `"[scenario-name]"`
    - Exectue Automation in Firefox
      > npm run test:scenario:firefox `"[scenario-name]"`

  - Specific Tag (usually to test specific tag on Development time)

    - Exectue Automation in Chrome
      > npm run test:tags:chrome `"[tags-name]"`
    - Exectue Automation in Firefox
      > npm run test:tags:firefox `"[tags-name]"`

- To Generate Report
  - To Clean Report Data
    > npm run report:clean
  - To generate Coverage Report
    > npm run report:generate
  - Access the report in quick httpSerer
    > npm run report:browse
  - To Zip Reports (usually done before pushing into Source Control)
    > npm run report:zip
  - To UnZip Reports (usually done to check exsting Reports pulled from Source Control)
    > npm run report:unzip

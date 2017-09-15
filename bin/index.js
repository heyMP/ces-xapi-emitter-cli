#!/usr/bin/env node
/*
 * Copyright 2017 Brigham Young University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const minimist    = require('minimist');
const events      = require('../lib/events');

const usageMsg = `Usage: cesxapi <args>

Options:
-l            -- List supported CES Events
-q            -- List all completed courses
-e [required] -- The CES Event to be rendered as an xAPI statement
-i [required] -- BYU ID that is the actor of the xAPI statement
-u [required] -- URL of the xAPI endpoint
-c [required] -- Client ID for OAuth 2.0 credentials to authenticate to the xAPI URL endpoint
-s [required] -- Client Secret for OAuth 2.0 credentials to authenticate to the xAPI URL endpoint
-d            -- If this flag is set, verbose debug output will be enabled

Example:
cesxapi -i 123456789 -e "Course Completed" -u https://example.com/data/xAPI/ -c 0bbd6609 -s 6b17958e
`;

function printAndExit(msg) {
  console.log(msg);
  process.exit(1);
}

function printGeneralUsage() {
  printAndExit(usageMsg);
}

function printUsageWithErrors(errors) {
  let usageMsgWithErrors = usageMsg +
`
Errors: 
  ${errors.join('\n  ')}`;
  printAndExit(usageMsgWithErrors);
}

if(process.argv.length == 2) {
  printGeneralUsage();
}

let argv = minimist(process.argv.slice(2));
if(argv.l) {
  console.log(`Supported CES events:
  ${events.supportedEvents().join('\n  ')}`);
}
else if(argv.q) {
  events.queryStatements(argv, function (statements) {
    console.log(`Completed Courses:
  ${statements.join('\n  ')}`);
    process.exit(0);
  });
}
else {
  let errors = events.validateArgs(argv);
  if (errors.length > 0) {
    printUsageWithErrors(errors);
  }
  else {
    events.processEvent(argv);
  }
}

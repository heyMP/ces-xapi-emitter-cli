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
exports.supportedEvents = function () {
  let list = [];
  list.push('Course Completed');
  list.push('Enrolled In Course');
  list.push('Enrolled In Program');
  list.push('Dropped Enrollment');
  list.push('Student Interested In Course');
  list.push('Begin Course Instruction');
  list.push('Enrolled In Year Term');
  list.push('Assessment Completed');
  return list;
};

exports.validateArgs = function (argv) {
  let errors = [];
  if(!argv.e) {
    errors.push("The '-e' parameter is required");
  }
  else {
    if(!exports.supportedEvents().includes(argv.e)) {
      errors.push("The -e parameter \""+argv.e+"\" is not in supported CES event list.");
    }
  }
  if(!argv.i) {
    errors.push("The '-i' parameter is required");
  }
  else {
    if(argv.i.toString().length != 9 ) {
      errors.push("The -i parameter \""+argv.i+"\" is not valid.");
    }
  }
  if(!argv.u) {
    errors.push("The '-u' parameter is required");
  }
  if(!argv.c) {
    errors.push("The '-c' parameter is required");
  }
  if(!argv.s) {
    errors.push("The '-s' parameter is required");
  }
  return errors;
};

exports.processEvent = function (argv) {
  const TinCan = require('tincanjs');

  let lrs;

  try {
    lrs = new TinCan.LRS(
      {
        endpoint: argv.u,
        username: argv.c,
        password: argv.s,
        allowFail: false
      }
    );
    var statement;
    if(argv.e === "Course Completed") {
      let now = new Date();
      statement = new TinCan.Statement(
        {
          "timestamp": now.toISOString(),
          "actor": {
            "account": {
              "homePage": "http://byu.edu",
              "name": argv.i.toString()
            },
            "objectType": "Agent"
          },
          "verb": {
            "id": "http://adlnet.gov/expapi/verbs/completed",
            "display": {
              "en-US": "completed"
            }
          },
          "object": {
            "id": "https://byupw.edu/api/courses/EnglishConnect",
            "definition": {
              "type": "http://adlnet.gov/expapi/activities/course",
              "name": {
                "en-US": "English Connect"
              },
              "description": {
                "en-US": "English Connect description"
              }
            },
            "objectType": "Activity"
          },
          "result": {
          },
          "context": {
            "language": "en-US"
          }
        }
      );

      lrs.saveStatement(
        statement,
        {
          callback: function (err, xhr) {
            if (err !== null) {
              if (xhr !== null) {
                console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
                // TODO: do something with error, didn't save statement
              }

              console.log("Failed to save statement: " + err);
              // TODO: do something with error, didn't save statement
            }
            else {
              console.log("Statement saved");
              // TODO: do something with success (possibly ignore)
            }
          }
        }
      );
    }
    else if (event.httpMethod === "GET") {
      lrs.queryStatements(
        {
          params: {
            verb: new TinCan.Verb(
              {
                id: "http://adlnet.gov/expapi/verbs/completed"
              }
            ),
            activity: new TinCan.Activity(
              {
                id: "http://adlnet.gov/expapi/activities/course"
              }
            )//,
            // since: "2015-05-20T01:11:11Z"
          },
          callback: function (err, sr) {
            if (err !== null) {
              console.log("Failed to query statements: " + err);
              // TODO: do something with error, didn't get statements
            }
            else {
              if (sr.more !== null) {
                // TODO: additional page(s) of statements should be fetched
              }

              // TODO: do something with statements in sr.statements
              console.log("statement",sr);
              let completed_statements = [];
              sr.statements.forEach(function (item) {
                if(item.verb.id === 'http://adlnet.gov/expapi/verbs/completed') {
                  completed_statements.push(item);
                }
              });
            }
          }
        }
      );
    }
    else if (event.httpMethod === "DELETE") {

      statement = new TinCan.Statement(
        {
          "actor": {
            "account": {
              "homePage": "http://byu.edu",
              "name": argv.i.toString()
            },
            "objectType": "Agent"
          },
          "verb": {
            "id": "http://adlnet.gov/expapi/verbs/voided",
            "display": {
              "en-US": "voided"
            }
          },
          "object": {
            "objectType": "StatementRef",
            "id": argv.r
          }
        }
      );

      lrs.saveStatement(
        statement,
        {
          callback: function (err, xhr) {
            if (err !== null) {
              if (xhr !== null) {
                console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
                // TODO: do something with error, didn't save statement
              }

              console.log("Failed to save statement: " + err);
              // TODO: do something with error, didn't save statement

            }

            console.log("Statement saved");
            // TODO: do something with success (possibly ignore)
          }
        }
      );
    }
  }
  catch (ex) {
    console.log("Failed to connect to LRS URL: " + ex);
    process.exit(1);
  }
};
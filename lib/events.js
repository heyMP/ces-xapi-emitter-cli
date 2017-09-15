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
const TinCan = require('tincanjs');

exports.supportedEvents = function () {
  let list = [];
  list.push('Course Completed');
  list.push('Enrolled In Course');
  list.push('Enrolled In Program');
  list.push('Program Completed');
  list.push('Dropped Enrollment');
  list.push('Student Interested In Course');
  list.push('Begin Course Instruction');
  list.push('Enrolled In Year Term');
  list.push('Degree Completed');
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
    let statement;
    let renderedStatement = getRenderedStatementFromTemplates(argv);
     {
      statement = new TinCan.Statement(renderedStatement);
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
  }
  catch (ex) {
    console.log("Failed to connect to LRS URL: " + ex);
    process.exit(1);
  }
};

function getRenderedStatementFromTemplates(argv) {
  let renderedStatement = {};
  let now = new Date();
  if(argv.e === "Enrolled In Course") {
    renderedStatement = {
      "timestamp": now.toISOString(),
      "actor":{
        "account":{
          "homePage":"http://byu.edu/",
          "name":argv.i.toString()
        }
      },
      "verb":{
        "id":"http://byu.edu/expapi/verbs/registered",
        "display":{
          "en-US":"registered"
        }
      },
      "object":{
        "id":"http://api.byu.edu/classes/20175,06387,001,001",
        "definition":{
          "name":{
            "en-US":"MATH 110"
          },
          "description":{
            "en-US":"College Algebra"
          },
          "type": "http://byu.edu/expapi/activities/course",
          "extensions": {
            "http://byu.edu/expapi/extensions/institution": "BYU",
            "http://byu.edu/expapi/extensions/year_term": "20175",
            "http://byu.edu/expapi/extensions/curriculum_id": "06387",
            "http://byu.edu/expapi/extensions/title_code": "001",
            "http://byu.edu/expapi/extensions/section_number": "001",
            "http://byu.edu/expapi/extensions/subject_area": "MATH",
            "http://byu.edu/expapi/extensions/catalog_number": "110",
            "http://byu.edu/expapi/extensions/catalog_suffix": "",
            "http://byu.edu/expapi/extensions/course_title": "College Algebra",
            "http://byu.edu/expapi/extensions/section_type": "DAY",
            "http://byu.edu/expapi/extensions/credit_hours": 3.0,
            "http://byu.edu/expapi/extensions/audit": false,
            "http://byu.edu/expapi/extensions/instructors": [
              {
                "id": "123456789",
                "name": "Billy Jones",
                "type": "Primary"
              }
            ]
          }
        }
      },
      "context":{
        "contextActivities":{
          "category": [
            {
              "id": "http://byu.edu/expapi/ces"
            }
          ]
        }
      }
    };
  }
  else if(argv.e === "Course Completed") {
    renderedStatement = {
      "timestamp": now.toISOString(),
      "actor":{
        "account":{
          "homePage":"http://byu.edu/",
          "name":argv.i.toString()
        }
      },
      "verb":{
        "id":"http://byu.edu/expapi/verbs/completed",
        "display":{
          "en-US":"completed"
        }
      },
      "object":{
        "id":"http://api.byu.edu/classes/20175,06387,001,001",
        "definition":{
          "name":{
            "en-US":"MATH 110"
          },
          "description":{
            "en-US":"College Algebra"
          },
          "type": "http://byu.edu/expapi/activities/course",
          "extensions": {
            "http://byu.edu/expapi/extensions/institution": "BYU",
            "http://byu.edu/expapi/extensions/year_term": "20175",
            "http://byu.edu/expapi/extensions/curriculum_id": "06387",
            "http://byu.edu/expapi/extensions/title_code": "001",
            "http://byu.edu/expapi/extensions/section_number": "001",
            "http://byu.edu/expapi/extensions/subject_area": "MATH",
            "http://byu.edu/expapi/extensions/catalog_number": "110",
            "http://byu.edu/expapi/extensions/catalog_suffix": "",
            "http://byu.edu/expapi/extensions/course_title": "College Algebra",
            "http://byu.edu/expapi/extensions/section_type": "DAY",
            "http://byu.edu/expapi/extensions/credit_hours": 3.0,
            "http://byu.edu/expapi/extensions/audit": false,
            "http://byu.edu/expapi/extensions/instructors": [
              {
                "id": "123456789",
                "name": "Billy Jones",
                "type": "Primary"
              }
            ]
          }
        }
      },
      "result":{
        "extensions": {
          "http://byu.edu/expapi/extensions/grade": "A-"
        }
      },
      "context":{
        "contextActivities":{
          "category": [
            {
              "id": "http://byu.edu/expapi/ces"
            }
          ]
        }
      }
    };
  }
  else if(argv.e === "Program Completed") {
    renderedStatement = {
      "timestamp": now.toISOString(),
      "actor":{
        "account":{
          "homePage":"http://byu.edu/",
          "name":argv.i.toString()
        }
      },
      "verb":{
        "id":"http://byu.edu/expapi/verbs/completed",
        "display":{
          "en-US":"completed"
        }
      },
      "object":{
        "id":"http://api.byu.edu/programs/28632",
        "definition":{
          "name":{
            "en-US":"Computer Science"
          },
          "description":{
            "en-US":"Computer Science"
          },
          "type": "http://byu.edu/expapi/activities/program",
          "extensions": {
            "http://byu.edu/expapi/extensions/institution": "BYU",
            "http://byu.edu/expapi/extensions/program_id": "28632",
            "http://byu.edu/expapi/extensions/program_code": "693220",
            "http://byu.edu/expapi/extensions/start_year_term": "19855",
            "http://byu.edu/expapi/extensions/end_year_term": "19874",
            "http://byu.edu/expapi/extensions/program_name": "Computer Science",
            "http://byu.edu/expapi/extensions/program_type": "Major",
            "http://byu.edu/expapi/extensions/program_degree": "BS",
            "http://byu.edu/expapi/extensions/program_degree_level": "4",
            "http://byu.edu/expapi/extensions/primary_program": true
          }
        }
      },
      "context":{
        "contextActivities":{
          "category": [
            {
              "id": "http://byu.edu/expapi/ces"
            }
          ]
        }
      }
    };
  }
  else if(argv.e === "Degree Completed") {
    renderedStatement = {
      "timestamp": now.toISOString(),
      "actor":{
        "account":{
          "homePage":"http://byu.edu/",
          "name":argv.i.toString()
        }
      },
      "verb":{
        "id":"http://byu.edu/expapi/verbs/completed",
        "display":{
          "en-US":"completed"
        }
      },
      "object":{
        "id":"http://api.byu.edu/degrees/BS",
        "definition":{
          "name":{
            "en-US":"BS"
          },
          "description":{
            "en-US":"Bachelor of Science"
          },
          "type": "http://byu.edu/expapi/activities/degree",
          "extensions": {
            "http://byu.edu/expapi/extensions/institution": "BYU",
            "http://byu.edu/expapi/extensions/program_degree": "BS",
            "http://byu.edu/expapi/extensions/program_degree_name": "Bachelor of Science",
            "http://byu.edu/expapi/extensions/program_degree_level": "4",
            "http://byu.edu/expapi/extensions/program_id": "28632",
            "http://byu.edu/expapi/extensions/program_code": "693220",
            "http://byu.edu/expapi/extensions/program_type": "Major",
            "http://byu.edu/expapi/extensions/year_term_awarded": "19874",
            "http://byu.edu/expapi/extensions/commencement_year_term": "19874",
            "http://byu.edu/expapi/extensions/program_name": "Computer Science"
          }
        }
      },
      "result":{
        "extensions": {
          "http://byu.edu/expapi/extensions/honors_distinction": "Cum Laude"
        }
      },
      "context":{
        "contextActivities":{
          "category": [
            {
              "id": "http://byu.edu/expapi/ces"
            }
          ]
        }
      }
    };
  }
  return renderedStatement;
}

exports.queryStatements = function (argv, main_callback) {
  let lrs;

  let completed_statements = [];
  try {
    lrs = new TinCan.LRS(
      {
        endpoint: argv.u,
        username: argv.c,
        password: argv.s,
        allowFail: false
      }
    );
    lrs.queryStatements(
      {
        params: {
          verb: new TinCan.Verb(
            {
              id: "http://byu.edu/expapi/verbs/completed"
            }
          )//,
          // activity: new TinCan.Activity(
          //   {
          //     definition: {
          //       type: "http://byu.edu/expapi/activities/course"
          //     }
          //   }
          // )//,
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
            sr.statements.forEach(function (item) {
              if(item.verb.id === 'http://byu.edu/expapi/verbs/completed') {
                completed_statements.push(item);
              }
            });
            main_callback(completed_statements);
          }
        }
      }
    );
  }
  catch (ex) {
    console.log("Failed to connect to LRS URL: " + ex);
    process.exit(1);
  }
};

exports.voidStatement = function (argv) {
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
          "id": "http://byu.edu/expapi/verbs/voided",
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
  catch (ex) {
    console.log("Failed to connect to LRS URL: " + ex);
    process.exit(1);
  }
};
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
const expect      = require('chai').expect;
const events      = require('../lib/events');

describe('cesxapi', function () {
  describe('events', function() {
    it('should fail if no parameters are provided', function() {
      let argv = {
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.not.equal(0);
    });

    it('should fail if the -e parameter is not provided', function() {
      let argv = {
        i: 123456789,
        u: "https://example.com/data/xAPI/",
        c: "0bbd6609",
        s: "6b17958e"
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.contain("The '-e' parameter is required");
    });

    it('should fail if the -i parameter is not provided', function() {
      let argv = {
        e: "Course Completed",
        u: "https://example.com/data/xAPI/",
        c: "0bbd6609",
        s: "6b17958e"
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.contain("The '-i' parameter is required");
    });

    it('should fail if the -u parameter is not provided', function() {
      let argv = {
        e: "Course Completed",
        i: 123456789,
        c: "0bbd6609",
        s: "6b17958e"
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.contain("The '-u' parameter is required");
    });

    it('should fail if the -c parameter is not provided', function() {
      let argv = {
        e: "Course Completed",
        i: 123456789,
        u: "https://example.com/data/xAPI/",
        s: "6b17958e"
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.contain("The '-c' parameter is required");
    });

    it('should fail if the -s parameter is not provided', function() {
      let argv = {
        e: "Course Completed",
        i: 123456789,
        u: "https://example.com/data/xAPI/",
        c: "0bbd6609",
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.contain("The '-s' parameter is required");
    });

    it('should fail if the -e parameter is not in the supported list of CES events', function() {
      let argv = {
        e: "Completed",
        i: 123456789,
        u: "https://example.com/data/xAPI/",
        c: "0bbd6609",
        s: "6b17958e"
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.contain("The -e parameter \"Completed\" is not in supported CES event list.");
    });

    it('should fail if the -i parameter is not 9 digits', function() {
      let argv = {
        e: "Course Completed",
        i: 12345678,
        u: "https://example.com/data/xAPI/",
        c: "0bbd6609",
        s: "6b17958e"
      };
      let errors = events.validateArgs(argv);
      expect(errors.length).to.equal(1);
      expect(errors[0]).to.contain("The -i parameter \"12345678\" is not valid.");
    });
  });
});
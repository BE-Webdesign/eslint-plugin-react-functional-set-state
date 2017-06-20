/**
 * @fileoverview Lint Rule for React to use functional setState
 * @author Edwin Cromley
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = {
  "no-this-state-props": require('./rules/no-this-state-props')
}

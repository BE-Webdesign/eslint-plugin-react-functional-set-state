/**
 * @fileoverview Lint Rule for React to use functional setState
 * @author Edwin Cromley
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = {
  'no-this-state-props': require('.lib/rules/no-this-state-props')
};

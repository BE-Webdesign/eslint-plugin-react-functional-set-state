/**
 * @fileoverview Lint Rule for React to use functional setState
 * @author Edwin Cromley
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of this.state and this.props in setState',
      category: 'Stylistic Issues',
      recommended: false
    },
    schema: []
  },

  create: function(context) {
    var setStateUsages = [];

    function isThisSetState (node) {
      if ( node.type === 'CallExpression' ) {
        var callee = node.callee;
        var isMatching = (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'ThisExpression' &&
          callee.property.name === 'setState'
        )
        return isMatching
      }
    }

    function isThisSetStateCallback (node) {
      if ( node.parent && node.parent.type === 'CallExpression' ) {
        var callee = node.parent.callee;
        var isMatching = (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'ThisExpression' &&
          callee.property.name === 'setState' &&
          node.parent.arguments[1] === node
        )
        return isMatching
      }
    }

    function isThisState(node) {
      var isMatching = (
        node.type === 'MemberExpression' &&
        node.object.type === 'ThisExpression' &&
        node.property.name === 'state'
      )
      return isMatching
    }

    function isThisProps(node) {
      var isMatching = (
        node.type === 'MemberExpression' &&
        node.object.type === 'ThisExpression' &&
        node.property.name === 'props'
      )
      return isMatching
    }

    /**
     * Reports usages of setState where this.props or this.state are used.
     * @param {Object} setStateUsages Usages of set state.
     */
    function reportSetStateUsages(setStateUsages) {
      var setStateUsage;
      for (var i = 0, j = setStateUsages.length; i < j; i++) {
        setStateUsage = setStateUsages[i];
        if ( isThisSetState(setStateUsage) ) {
          context.report({
            node: setStateUsage,
            message: 'Do not access this.state or this.props in setState(), instead apply a function with signature ( state, [props] ) to setState and access state and props.'
          });
        }
      }
    }

    return {
      CallExpression: function(node) {
        var callee = node.callee;
        if ( ! isThisSetState(node) ) {
          setStateUsages.push(callee);
        }
      },

      MemberExpression: function(node) {
        if ( isThisProps(node) || isThisState(node) ) {
          var ancestors = context.getAncestors()
          if ( ancestors.some(isThisSetState) && !ancestors.some(isThisSetStateCallback) ) {
            var setStateUsage = ancestors.find(isThisSetState)
            setStateUsages.push(setStateUsage);
          }
        }
      },

      'Program:exit': function() {
        reportSetStateUsages(setStateUsages);
      }
    }
  }
};

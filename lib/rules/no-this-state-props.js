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
    const setStateUsages = [];

    /**
     * Checks to see if this is a this.setState call.
     *
     * @param {Object} node AST Node.
     */
    function isThisSetState (node) {
      if (node.type === 'CallExpression') {
        const callee = node.callee;
        const isMatching = (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'ThisExpression' &&
          callee.property.name === 'setState'
        );
        return isMatching;
      }
      return false;
    }

    /**
     * Checks whether this is `this.setState( doUpdates, CALLBACK )`.
     *
     * This is used to determine whether the secondary callback in this.setState
     * can allow the use of this.state and this.props.
     *
     * @param {Object} node AST Node.
     */
    function isThisSetStateCallback (node) {
      if (node.parent && node.parent.type === 'CallExpression') {
        const parent = node.parent;
        const isMatching = (
          isThisSetState(parent) &&
          parent.arguments &&
          parent.arguments.length > 1 &&
          parent.arguments[1] === node
        );
        return isMatching;
      }
      return false;
    }

    /**
     * Checks whether this is `this.state`.
     * @param {Object} node AST Node.
     */
    function isThisState(node) {
      const isMatching = (
        node.type === 'MemberExpression' &&
        node.object.type === 'ThisExpression' &&
        node.property.name === 'state'
      );
      return isMatching;
    }

    /**
     * Checks whether this is `this.props`.
     * @param {Object} node AST Node.
     */
    function isThisProps(node) {
      const isMatching = (
        node.type === 'MemberExpression' &&
        node.object.type === 'ThisExpression' &&
        node.property.name === 'props'
      );
      return isMatching;
    }

    /**
     * Reports usages of setState where this.props or this.state are used.
     * @param {Array} setStateCalls Usages of set state.
     */
    function reportSetStateUsages(setStateCalls) {
      let setStateUsage;
      for (let i = 0, j = setStateCalls.length; i < j; i++) {
        setStateUsage = setStateCalls[i];
        if (isThisSetState(setStateUsage)) {
          context.report({
            node: setStateUsage,
            message: 'Do not access this.state or this.props in setState(), instead apply a function with signature ( state, [props] ) to setState and access state and props.'
          });
        }
      }
    }

    return {
      CallExpression: function(node) {
        const callee = node.callee;
        if (isThisSetState(node)) {
          setStateUsages.push(callee);
        }
      },

      MemberExpression: function(node) {
        if (isThisProps(node) || isThisState(node)) {
          const ancestors = context.getAncestors();
          if (ancestors.some(isThisSetState) && !ancestors.some(isThisSetStateCallback)) {
            const setStateUsage = ancestors.find(isThisSetState);
            setStateUsages.push(setStateUsage);
          }
        }
      },

      'Program:exit': function() {
        reportSetStateUsages(setStateUsages);
      }
    };
  }
};

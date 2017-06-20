/**
 * @fileoverview Tests for no-with rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-this-state-props");
var RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-this-state-props", rule, {
    valid: [
        {
            code: "this.setState( { opened: yolo } )",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "this.setState( ( state ) => ( { opened: ! state.open } ) )",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "this.setState( ( state, props ) => ( { opened: ! props.open } ) )",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var yolo = this.state.yolo; this.setState( ( state, props ) => ( { opened: ! props.open } ) )",
            parserOptions: { ecmaVersion: 6 }
        },
    ],
    invalid: [
        {
            code: "this.setState( { opened: this.state.opened } )",
            errors: [{ message: "Do not access this.state or this.props in setState(), instead apply a function with signature ( state, [props] ) to setState and access state and props."}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "this.setState( { opened: this.props.opened } )",
            errors: [{ message: "Do not access this.state or this.props in setState(), instead apply a function with signature ( state, [props] ) to setState and access state and props."}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "this.setState( ( state ) => ( { opened: this.state.opened } ) )",
            errors: [{ message: "Do not access this.state or this.props in setState(), instead apply a function with signature ( state, [props] ) to setState and access state and props."}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "this.setState( ( state ) => ( { opened: { inside: this.props.opened } } ) )",
            errors: [{ message: "Do not access this.state or this.props in setState(), instead apply a function with signature ( state, [props] ) to setState and access state and props."}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "this.setState( ( state ) => { var taco = this.state.taco; return { opened: taco }; } )",
            errors: [{ message: "Do not access this.state or this.props in setState(), instead apply a function with signature ( state, [props] ) to setState and access state and props."}],
            parserOptions: { ecmaVersion: 6 }
        }
    ]
});

# eslint-plugin-react-functional-set-state

Lint Rule for React to use functional setState and prevent the use of accessing
this.state and this.props inside of setState calls.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-react-functional-set-state`:

```
$ npm install eslint-plugin-react-functional-set-state --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-react-functional-set-state` globally.

## Usage

Add `react-functional-set-state` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "react-functional-set-state"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "react-functional-set-state/no-this-state-props": 2
    }
}
```

## Supported Rules

* no-this-state-props

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },

  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "mocha": true
  },

  "plugins": [
    "standard",
    "react"
  ],

  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],

  "globals": {
    "document": false,
    "navigator": false,
    "window": false
  },

  "rules": {
    "accessor-pairs": ERROR,
    "arrow-spacing": [ERROR, { "before": true, "after": true }],
    "block-spacing": [ERROR, "always"],
    "brace-style": [ERROR, "1tbs", { "allowSingleLine": true }],
    "comma-dangle": [ERROR, "never"],
    "comma-spacing": [ERROR, { "before": false, "after": true }],
    "comma-style": [ERROR, "last"],
    "constructor-super": ERROR,
    "curly": [ERROR, "multi-line"],
    "dot-location": [ERROR, "property"],
    "eol-last": ERROR,
    "eqeqeq": [ERROR, "allow-null"],
    "generator-star-spacing": [ERROR, { "before": true, "after": true }],
    "handle-callback-err": [ERROR, "^(err|error)$" ],
    "indent": [ERROR, 4, { "SwitchCase": 1 }],
    "key-spacing": [ERROR, { "beforeColon": false, "afterColon": true }],
    "keyword-spacing": ERROR,
    "new-cap": [ERROR, { "newIsCap": true, "capIsNew": false }],
    "new-parens": ERROR,
    "no-array-constructor": ERROR,
    "no-caller": ERROR,
    "no-class-assign": ERROR,
    "no-cond-assign": ERROR,
    "no-const-assign": ERROR,
    "no-control-regex": ERROR,
    "no-debugger": ERROR,
    "no-delete-var": ERROR,
    "no-dupe-args": ERROR,
    "no-dupe-class-members": ERROR,
    "no-dupe-keys": ERROR,
    "no-duplicate-case": ERROR,
    "no-empty-character-class": ERROR,
    "no-eval": ERROR,
    "no-ex-assign": ERROR,
    "no-extend-native": ERROR,
    "no-extra-bind": ERROR,
    "no-extra-boolean-cast": ERROR,
    "no-extra-parens": [ERROR, "functions"],
    "no-extra-semi": ERROR,
    "no-fallthrough": ERROR,
    "no-floating-decimal": ERROR,
    "no-func-assign": ERROR,
    "no-implied-eval": ERROR,
    "no-inner-declarations": [ERROR, "functions"],
    "no-invalid-regexp": ERROR,
    "no-irregular-whitespace": ERROR,
    "no-iterator": ERROR,
    "no-label-var": ERROR,
    "no-labels": ERROR,
    "no-lone-blocks": ERROR,
    "no-mixed-spaces-and-tabs": ERROR,
    "no-multi-spaces": ERROR,
    "no-multi-str": ERROR,
    "no-multiple-empty-lines": [ERROR, { "max": 1 }],
    "no-native-reassign": ERROR,
    "no-negated-in-lhs": ERROR,
    "no-new": ERROR,
    "no-new-func": ERROR,
    "no-new-object": ERROR,
    "no-new-require": ERROR,
    "no-new-wrappers": ERROR,
    "no-obj-calls": ERROR,
    "no-octal": ERROR,
    "no-octal-escape": ERROR,
    "no-proto": ERROR,
    "no-redeclare": ERROR,
    "no-regex-spaces": ERROR,
    "no-return-assign": ERROR,
    "no-self-compare": ERROR,
    "no-sequences": ERROR,
    "no-shadow-restricted-names": ERROR,
    "no-spaced-func": ERROR,
    "no-sparse-arrays": ERROR,
    "no-this-before-super": ERROR,
    "no-throw-literal": ERROR,
    "no-trailing-spaces": [ERROR, {"skipBlankLines": true}],
    "no-undef": ERROR,
    "no-undef-init": ERROR,
    "no-unexpected-multiline": ERROR,
    "no-unneeded-ternary": [ERROR, { "defaultAssignment": false }],
    "no-unreachable": ERROR,
    "no-unused-vars": [ERROR, { "vars": "all", "args": "none", "ignore": "React" }],
    "no-useless-call": ERROR,
    "no-var": ERROR,
    "no-with": ERROR,
    "one-var": [ERROR, { "initialized": "never" }],
    "operator-linebreak": [ERROR, "after", { "overrides": { "?": "before", ":": "before" } }],
    "padded-blocks": [ERROR, "never"],
    "quotes": [ERROR, "single", "avoid-escape"],
    "radix": ERROR,
    "semi": [ERROR, "always"],
    "semi-spacing": [ERROR, { "before": false, "after": true }],
    "space-before-function-paren": [ERROR, "never"],
    "space-in-parens": [ERROR, "never"],
    "space-infix-ops": ERROR,
    "space-unary-ops": [ERROR, { "words": true, "nonwords": false }],
    "spaced-comment": [ERROR, "always", { "markers": ["global", "globals", "eslint", "eslint-disable", "*package", "!", ","] }],
    "use-isnan": ERROR,
    "valid-typeof": ERROR,
    "wrap-iife": [ERROR, "any"],
    "yoda": [ERROR, "never"],

    "react/prefer-es6-class": WARNING,
    "react/jsx-uses-react": ERROR,
    "react/display-name": OFF, // do not force displayName property in every component (used in react debugging messages)

    "standard/object-curly-even-spacing": [ERROR, "either"],
    "standard/array-bracket-even-spacing": [ERROR, "either"],
    "standard/computed-property-even-spacing": [ERROR, "even"]
  }
}
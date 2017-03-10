module.exports = {
    "env": {
        "mocha": true,
        "node": true
    },
    "extends": [
      "eslint:recommended",
      "standard"
    ],
    "plugins": [
        "standard",
        "promise"
    ],
    "rules": {
      "arrow-body-style": ["error"],
      "arrow-parens": ["error"],
      "arrow-spacing": ["error"],
      "no-var": ["error"],
      "prefer-arrow-callback": ["error"],
      "prefer-const": ["error"],
      "prefer-spread": ["error"],
      "prefer-template": ["error"],
      "rest-spread-spacing": ["error"],
      "template-curly-spacing": ["error"]
    }
};

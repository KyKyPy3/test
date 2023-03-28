module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-implied-eval": "error",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-unsafe-argument": "off",

    "@typescript-eslint/no-empty-function": [
      "error",
      {
        "allow": [
          "arrowFunctions",
          "functions",
          "methods",
        ]
      }
    ],
    "@typescript-eslint/no-extra-parens": [
      "off",
      "all",
      {
        "conditionalAssign": true,
        "nestedBinaryExpressions": false,
        "returnAssign": false,
        "enforceForArrowConditionals": false
      }
    ],

    "@typescript-eslint/indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "VariableDeclarator": 1,
        "outerIIFEBody": 1,
        "FunctionDeclaration": {
          "parameters": 1,
          "body": 1
        },
        "FunctionExpression": {
          "parameters": 1,
          "body": 1
        },
        "CallExpression": {
          "arguments": 1
        },
        "ArrayExpression": 1,
        "ObjectExpression": 1,
        "ImportDeclaration": 1,
        "flatTernaryExpressions": false,
        "ignoreComments": false
      }
    ],

    "@typescript-eslint/unified-signatures": "error",
    "@typescript-eslint/promise-function-async": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/no-dynamic-delete": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/keyword-spacing": [
      "error",
      {
        "before": true,
        "after": true,
        "overrides": {
          "return": {
            "after": true
          },
          "throw": {
            "after": true
          },
          "case": {
            "after": true
          }
        }
      }
    ],
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/dot-notation": [
      "error",
      {
        "allowKeywords": true
      }
    ],
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      "accessibility": "explicit",
      "overrides": {
        "accessors": "off",
        "constructors": "no-public",
        "methods": "explicit",
        "properties": "explicit",
        "parameterProperties": "explicit"
      },
    }],
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/typedef": [
        "error",
        {
            "propertyDeclaration": true
        }
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",

    ///


    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/return-await": "error",
    "@typescript-eslint/space-before-function-paren": [
      "error", {
        "anonymous": "always",
        "asyncArrow": "always",
        "named": "never"
      }
    ],
    "@typescript-eslint/func-call-spacing": [
      "error",
      "never"
    ],
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/method-signature-style": "error",
    "@typescript-eslint/no-redeclare": "error",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-loop-func": "error",
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        "functions": true,
        "classes": true,
        "variables": true
      }
    ],
    
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "PascalCase", "UPPER_CASE"]
      },
      {
        "selector": "function",
        "format": ["camelCase", "PascalCase"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      },
    ],
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        "allowShortCircuit": false,
        "allowTernary": false,
        "allowTaggedTemplates": false
      }
    ],

    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "@typescript-eslint/no-extraneous-class": [
      "error",
      {
        "allowConstructorOnly": true,
        "allowStaticOnly": true,
        "allowEmpty": true
      }
    ],
    // "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-extra-semi": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": true,
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/consistent-type-assertions": "error",
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/brace-style": [
      "error",
      "1tbs", { "allowSingleLine": true }
    ],
    "@typescript-eslint/comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "always-multiline",
        "enums": "always-multiline",
        "generics": "always-multiline",
        "tuples": "always-multiline"
      },
    ],
    "@typescript-eslint/no-magic-numbers": [
      "off",
      {
        "ignore": [],
        "ignoreArrayIndexes": true,
        "enforceConst": true,
        "detectObjects": false
      }
    ],
    "@typescript-eslint/comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/space-infix-ops": "error",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/lines-between-class-members": [
      "error",
      "always",
      {
        "exceptAfterSingleLine": false
      }
    ],
    "@typescript-eslint/no-dupe-class-members": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/no-confusing-void-expression": [
      "error",
      { "ignoreArrowShorthand": true }
    ],
    "@typescript-eslint/return-await": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/unbound-method": [
      "error",
      {
        "ignoreStatic": true
      }
    ],
  },
};

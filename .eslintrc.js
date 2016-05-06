//ESlint config based on Airbnb's
module.exports = {
  'env': {
    'browser': false,
    'es6': true,
    'node': true
  },
  'globals':{
    'config':true,
    'log':true,
    'conf':true
  },
  'extends': 'eslint:recommended',
  'rules': {
    'array-bracket-spacing': [2, 'never'],
    'brace-style': [2, '1tbs', {      'allowSingleLine': true    }],
    //  'camelcase': [2, {      'properties': 'never'    }],
    'comma-dangle': [2, 'never'],
    'comma-spacing': [2, {      'before': false,      'after': true    }],
    'comma-style': [2, 'last'],
    'computed-property-spacing': [2, 'never'],
    'consistent-this': 0,
    'eol-last': 2,
    'id-length': 0,
    'indent': [2, 2, {      'SwitchCase': 1,      'VariableDeclarator': 1    }],
    'key-spacing': 2,
    'keyword-spacing': 2,
    'linebreak-style': [2, 'unix'],
    'max-depth': [0, 4],
    'max-params': [0, 3],
    'max-statements': [0, 10],
    'no-array-constructor': 2,
    'no-bitwise': 0,
    'no-cond-assign': 2,
    'no-new-object': 2,
    'no-plusplus': 1,
    'no-trailing-spaces': 2,
    'no-unused-vars': [2, {      'vars': 'all',      'varsIgnorePattern': '[iI]gnored'    }],
    'object-curly-spacing': [2, 'always'],
    'operator-assignment': [1, 'never'],
    'quote-props': [2, 'as-needed'],
    'quotes': [2, 'single'],
    'semi': [2, 'always'],
    'semi-spacing': [2, {      'before': false,      'after': true    }],
    'space-before-blocks': 2,
    'space-before-function-paren': [2, { 'anonymous': 'always', 'named': 'never' }],
    'space-infix-ops': 2,
    'new-cap': [2, { 'newIsCap': true, 'capIsNewExceptions': ['Router'] }],
    'padded-blocks': [2, 'never'],


    // Best Practices
    'no-new': 2,
    'no-param-reassign': 2,
    'no-return-assign': 2,
    'no-sequences': 2,
    'eqeqeq': 2,
    'wrap-iife': [2, 'inside'],
    'no-loop-func': 2,

    //Ok in dev, not in prod
    'no-console': 1,
  }
};

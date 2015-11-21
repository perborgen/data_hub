/**
 * index.js
 * ========
 * ES6 bootstrapping. All subsequent required files (.js, .jsx, .es, .es6)
 * will be transformed by Babel.
 *
 * @author: Ben Gundersen
 */

// Babel require hook.
// See https://babeljs.io/docs/usage/require/
require('babel/register');
// Our Node entry point.
require('./main.js');

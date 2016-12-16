//= require support/sinon
//= require support/chai
//= require support/chai-jq-0.0.7
//= require support/sinon-chai

//= require pageflow/application
//= require pageflow/editor

//= require_self
//= require ./support/dominos/base
//= require_tree ./support

window.support = {};
window.expect = chai.expect;

// Some classes statically depend on pageflow being defined.
pageflow.config = {};
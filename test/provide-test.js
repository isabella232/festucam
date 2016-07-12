/*global dust: true */
var dust = require('dustjs-linkedin');
dust.debugLevel = 'DEBUG';
require('dustjs-helpers');
require('./helpers/message');
require('../src/helpers/data/provide/provide');
var assert = require('assert');

describe('provide', function () {
  it('simple param', function () {
    var context = {};
    var code = '{@provide}{#param}{.}{/param}{:param}[1,2,3]{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '123');
    });
  }),
  it('empty param-note: completely empty is invalid JSON', function () {
    var context = {};
    var code = '{@provide}{#param}{.}{/param}{:param}""{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '');
    });
  }),
  it('param on helper available in block', function () {
    var context = {};
    var code = '{@provide p="0"}{p}{#param}{.}{/param}{:param}[1,2,3]{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '0123');
    });
  }),
  it('param on helper available in block with strings', function () {
    var context = {};
    var code = '{@provide}{p}{#param}{.}{/param}{:param}["a","b","c"]{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, 'abc');
    });
  }),
  it('param on helper available in param block', function () {
    var context = {};
    var code = '{@provide p="0"}{#param}{.}{/param}{:param}[1,2,{p}]{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '120');
    });
  }),
  it('param from param block overrides param on helper but param block can use helper param', function () {
    var context = {};
    var code = '{@provide p="0"}{p}{:p}1{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '1');
    });
  }),
  it('param from param block overrides param on helper', function () {
    var context = {};
    var code = '{@provide p="0"}{p}{:p}{p}{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '0');
    });
  }),
  it('supply two blocks', function () {
    var context = {};
    var code = '{@provide}{#p2}{.}{/p2}{#param}{.}{/param}{:param}[1,2,3]{:p2}[3,4,5,6]{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '3456123');
    });
  }),
  it('supply an object', function () {
    var context = {};
    var code = '{@provide}{param.pi}{:param}{"pi":"3.1415"}{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '3.1415');
    });
  }),
  it('Handle invalid JSON', function () {
    var context = {};
    var code = '{@provide}{param}{:param}{bad{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '{bad');
    });
  }),
  it('capture helper value in object', function () {
    var context = {
      obj: [1, 2, 3, 4, 5, 6]
    };
    var code = '{@provide}{param.len}{:param}{"len":{@size key=obj/}}{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '6');
    });
  }),
  it('capture helper as simple value', function () {
    var context = {
      obj: [1, 2, 3, 4, 5, 6]
    };
    var code = '{@provide}{param}{:param}{@size key=obj/}{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, '6');
    });
  });
  it('param can be complex object', function () {
    //simulates https://github.com/krakenjs/dust-message-helper mode=paired use case
    var context = {
      obj: [{"$id":"foo","$elt":"bar"},{"$id":"bing","$elt":"bang"},{"$id":"baz","$elt":"biff"}]
    };
    var code = '{@provide}{#param}{$id}{/param}{:param}{@message obi=obj/}{/provide}';
    dust.renderSource(code, context, function (err, out) {
      assert.equal(out, 'foobingbaz');
    });
  });
});

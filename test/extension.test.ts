//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import {Escaper} from '../src/escaper'

// Defines a Mocha test suite to group tests of similar kind together
suite("Unescape Tests", () => {
    const testString = "R\\xF8d gr\\370d med fl\\u00F8de. \\u{1F680}";

    var escaper = new Escaper();
    
    test("unescapeAll", () => {
        assert.equal(escaper.unescapeAll(testString), "Rød grød med fløde. 🚀");
    });
    test("unescapeHex", () => {
        assert.equal(escaper.unescapeHex(testString), "Rød gr\\370d med fl\\u00F8de. \\u{1F680}");
    });
    test("unescapeOctal", () => {
        assert.equal(escaper.unescapeOctal(testString), "R\\xF8d grød med fl\\u00F8de. \\u{1F680}");
    });
    test("unescapeUnicode", () => {
        assert.equal(escaper.unescapeUnicode(testString), "R\\xF8d gr\\370d med fløde. 🚀");
    });
});

suite("Escape Tests", () => {
    const testString = "Rød grød med fløde. 🚀";

    var escaper = new Escaper();
    
    test("escapeHex", () => {
        assert.equal(escaper.escapeHex(testString), "R\\xF8d gr\\xF8d med fl\\xF8de. 🚀");
    });
    test("escapeOctal", () => {
        assert.equal(escaper.escapeOctal(testString), "R\\370d gr\\370d med fl\\370de. 🚀");
    });
    test("escapeUnicode", () => {
        assert.equal(escaper.escapeUnicode(testString), "R\\u00F8d gr\\u00F8d med fl\\u00F8de. \\uD83D\\uDE80");
    });
    test("escapeUnicodeES6", () => {
        assert.equal(escaper.escapeUnicodeES6(testString), "R\\u{F8}d gr\\u{F8}d med fl\\u{F8}de. \\u{1F680}");
    });
});
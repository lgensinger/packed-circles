import test from "ava";

import { configurationDimension, configurationLayout } from "../src/configuration.js";
import { PackedCircles } from "../src/packed-circles/index.js";

let testData = [{id: "some|path", value: 1}, {id: "some", value: 3}];

/******************** EMPTY VARIABLES ********************/

// TEST INIT //
test("init", t => {

    // initialize
    let pc = new PackedCircles();

    t.true(pc.height === configurationDimension.height);
    t.true(pc.paddingCircles === configurationLayout.paddingCircles);
    t.true(pc.width === configurationDimension.width);

});

// TEST get DATA //
test("get_data", t => {

    // initialize
    let pc = new PackedCircles();

    // data formatting
    let result = pc.data;

    t.true(typeof(result) == "object");

});

// TEST get LAYOUT //
test("get_layout", t => {

    // initialize
    let pc = new PackedCircles();

    // layout formatting
    let result = pc.layout;
    t.true(typeof(result) == "function");

});

// TEST get STYLE //
test("get_style", t => {

    // initialize
    let pc = new PackedCircles();

    // style formatting
    let result = pc.style;

    t.true(typeof(result) == "function");

});

// TEST EXTRACTLABEL //
test("extractLabel", t => {

    // initialize
    let pc = new PackedCircles();

    // pull node label from id
    let result = pc.extractLabel(testData[0]);

    t.true(typeof(result) == "string");
    t.true(testData[0].id.includes(result));

});

// TEST RENDER //
test("render", t => {

    // clear document
    document.body.innerHTML = "";

    // initialize
    let pc = new PackedCircles();

    // render to dom
    pc.render(document.body);

    // get generated element
    let artboard = document.querySelector(".ha-packed-circles");

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");
    t.true(artboard.getAttribute("viewBox").split(" ")[3] == configurationDimension.height);
    t.true(artboard.getAttribute("viewBox").split(" ")[2] == configurationDimension.width);

});

/******************** DECLARED PARAMS ********************/

let testWidth = 300;
let testHeight = 500;
let testPadding = 5;

// TEST INIT //
test("init_params", t => {

    // initialize
    let pc = new PackedCircles(testData, testWidth, testHeight, testPadding);

    t.true(pc.height === testHeight);
    t.true(pc.paddingCircles === testPadding);
    t.true(pc.width === testWidth);

});

// TEST get DATA //
test("get_data_params", t => {

    // initialize
    let pc = new PackedCircles(testData, testWidth, testHeight, testPadding);

    // data formatting
    let result = pc.data;

    t.true(typeof(result) == "object");

});

// TEST get LAYOUT //
test("get_layout_params", t => {

    // initialize
    let pc = new PackedCircles(testData, testWidth, testHeight, testPadding);

    // layout formatting
    let result = pc.layout;

    t.true(typeof(result) == "function");

});

// TEST get STYLE //
test("get_style_params", t => {

    // initialize
    let pc = new PackedCircles(testData, testWidth, testHeight, testPadding);

    // style formatting
    let result = pc.style;

    t.true(typeof(result) == "function");

});

// TEST EXTRACTLABEL //
test("extractLabel_params", t => {

    // initialize
    let pc = new PackedCircles(testData, testWidth, testHeight, testPadding);

    // pull node label from id
    let result = pc.extractLabel(testData[0]);

    t.true(typeof(result) == "string");
    t.true(testData[0].id.includes(result));

});

// TEST RENDER //
test("render_params", t => {

    // clear document
    document.body.innerHTML = "";

    // initialize
    let pc = new PackedCircles(testData, testWidth, testHeight, testPadding);

    // render to dom
    pc.render(document.body);

    // get generated element
    let artboard = document.querySelector(".ha-packed-circles");

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");
    t.true(artboard.getAttribute("viewBox").split(" ")[3] == testHeight);
    t.true(artboard.getAttribute("viewBox").split(" ")[2] == testWidth);

});

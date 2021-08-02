import test from "ava";

import { configuration, configurationDimension, configurationLayout } from "../src/configuration.js";
import { PackedCircles } from "../src/index.js";

/******************** EMPTY VARIABLES ********************/

// initialize
let pc = new PackedCircles();

// TEST INIT //
test("init", t => {

    t.true(pc.height === configurationDimension.height);
    t.true(pc.paddingCircles === configurationLayout.paddingCircles);
    t.true(pc.width === configurationDimension.width);

});

// TEST get DATA //
test("get_data", t => {

    t.true(typeof(pc.data) == "object");

});

// TEST get LAYOUT //
test("get_layout", t => {

    t.true(typeof(pc.layout) == "function");

});

// TEST EXTRACTLABEL //
test("extractLabel", t => {

    // pull node label from id
    let result = pc.extractLabel(testData[0]);

    t.true(typeof(result) == "string");
    t.true(testData[0].id.includes(result));

});

// TEST RENDER //
test("render", t => {

    // clear document
    document.body.innerHTML = "";

    // render to dom
    pc.render(document.body);

    // get generated element
    let artboard = document.querySelector(`.${configuration.name}`);

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");
    t.true(artboard.getAttribute("viewBox").split(" ")[3] == configurationDimension.height);
    t.true(artboard.getAttribute("viewBox").split(" ")[2] == configurationDimension.width);

});

/******************** DECLARED PARAMS ********************/

let testWidth = 300;
let testHeight = 500;
let testPadding = 5;
let testData = [
    {id: "some|path", value: 1},
    {id: "some", value: 3}
];

// initialize
let pcr = new PackedCircles(testData, testWidth, testHeight, testPadding);


// TEST INIT //
test("init_params", t => {

    t.true(pcr.height === testHeight);
    t.true(pcr.paddingCircles === testPadding);
    t.true(pcr.width === testWidth);

});

// TEST get DATA //
test("get_data_params", t => {

    t.true(typeof(pcr.data) == "object");

});

// TEST get LAYOUT //
test("get_layout_params", t => {

    t.true(typeof(pcr.layout) == "function");

});

// TEST EXTRACTLABEL //
test("extractLabel_params", t => {

    // pull node label from id
    let result = pcr.extractLabel(testData[0]);

    t.true(typeof(result) == "string");
    t.true(testData[0].id.includes(result));

});

// TEST RENDER //
test("render_params", t => {

    // clear document
    document.body.innerHTML = "";

    // render to dom
    pcr.render(document.body);

    // get generated element
    let artboard = document.querySelector(`.${configuration.name}`);

    t.true(artboard !== undefined);
    t.true(artboard.nodeName == "svg");
    t.true(artboard.getAttribute("viewBox").split(" ")[3] == testHeight);
    t.true(artboard.getAttribute("viewBox").split(" ")[2] == testWidth);

});

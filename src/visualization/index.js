import { pack, stratify } from "d3-hierarchy";
import { select } from "d3-selection";

import { configuration, configurationDimension, configurationLayout, configurationParse } from "../configuration.js";
import { mouseOverIds } from "../utilities.js";

/**
 * PackedCircles is a hierarchy visualization.
 * @param {array} data - objects where each represents a path in the hierarchy
 * @param {integer} height - artboard height
 * @param {integer} width - artboard width
 * @param {integer} paddingCircles - space between packed circles
 */
class PackedCircles {
    constructor(data, width=configurationDimension.width, height=configurationDimension.height, paddingCircles=configurationLayout.paddingCircles) {

        // update self
        this.dataSource = data;
        this.height = height;
        this.label = null;
        this.node = null;
        this.paddingCircles = paddingCircles;
        this.width = width;

        // condition data
        this.dataFormatted = this.data;
        this.nodes = this.dataFormatted ? [...new Set(this.dataFormatted.leaves().map(d => this.extractLabel(d.data)))].sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())) : null;

    }

    /**
     * Condition data for visualization requirements.
     * @returns An array of self-referencing nodes.
     */
    get data() {

        let result = null;

        // verify valid source provided
        if (this.dataSource && this.dataSource.length > 0) {

            // build hierarchy from flat data
            let hierarchy = stratify()
                .parentId(d => d.id.substring(0, d.id.lastIndexOf(configurationParse.delimeter)));

            // build nest
            let nestedData = hierarchy(this.dataSource)
                .sort((a,b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase()));

            // calculate layout leaves
            let hierarchyData = nestedData
                .sum(d => d.value)
                .sort((a,b) => a.id.toLowerCase().localeCompare(b.id.toLowerCase()));

            // process for layout
            result = this.layout(hierarchyData);

        }

        return result;

    }

    /**
     * Construct layout.
     * @returns A d3 pack layout function.
     */
    get layout() {

        let radius = Math.min( ...[this.height, this.width]);

        return pack()
            .size([radius, radius])
            .padding(this.paddingCircles);
    }

    /**
     * Position and minimally style labels in SVG dom element.
     */
    configureLabels() {
        this.label
            .attr("class", "lgv-label")
            .attr("x", d => d.x)
            .attr("y", d => d.children ? (d.y - (d.r * 0.9)) : d.y)
            .text(d => this.extractLabel(d));
    }

    /**
     * Position and minimally style nodes in SVG dom element.
     */
    configureNodes() {
        this.node
            .attr("class", "lgv-node")
            .attr("data-node-label", d => this.extractLabel(d))
            .attr("data-node-depth", d => d.depth)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r);
    }

    /**
     * Extract label from full hierarchy path.
     * @param {object} d - datum inside d3 data
     * @returns A string which represents the label for a node.
     */
    extractLabel(d) {
        return d.id.split(configurationParse.delimeter)[d.id.split(configurationParse.delimeter).length - 1];
    }

    /**
     * Generate SVG artboard in the HTML DOM.
     * @param {node} domNode - HTML node
     * @returns A d3.js selection.
     */
    generateArtboard(domNode) {
        return select(domNode)
            .append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("class", configuration.name);
    }

    /**
     * Generate labels in SVG element.
     * @param {node} domNode - d3.js SVG selection
     */
    generateLabels(domNode) {
        return domNode
            .selectAll("text")
            .data(this.dataFormatted ? this.dataFormatted.descendants() : [])
            .enter()
            .append("text");
    }

    /**
     * Generate nodes in SVG element.
     * @param {node} domNode - d3.js SVG selection
     * @returns A d3.js selection.
     */
    generateNodes(domNode) {
        return domNode
            .selectAll("circle")
            .data(this.dataFormatted ? this.dataFormatted.descendants() : [])
            .enter()
            .append("circle");

    }

    /**
     * Render visualization.
     * @param {node} domNode - HTML node
     */
    render(domNode) {

        // generate svg artboard
        let artboard = this.generateArtboard(domNode);

        // generate nodes
        this.node = this.generateNodes(artboard);

        // position/style nodes
        this.configureNodes();

        // generate text label
        this.label = this.generateLabels(artboard);

        // position/style labels
        this.configureLabels();

    }

    /**
     * Reset visualization to initial state.
     */
    reset() {

        // reset nodes
        this.node.attr("class", "lgv-node");

        // reset labels
        this.label.attr("class", "lgv-label");

    }

    /** Set nodes/labels to active state.
     * @param {array} selected - each item is a string representing a node label
     */
    setActive(selected) {

        // set node
        this.node.attr("class", x =>  mouseOverIds(selected, this.dataSource).includes(x.id) ? "lgv-node active" : "lgv-node inactive");

        // set labels
        this.label.attr("class", x => mouseOverIds(selected, this.dataSource).includes(x.id) ? "lgv-label active" : "lgv-label inactive");

    }

};

export { PackedCircles };
export default PackedCircles;

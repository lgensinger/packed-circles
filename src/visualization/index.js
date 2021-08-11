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
        this.artboard = null;
        this.dataSource = data;
        this.delimeter = configurationParse.delimeter;
        this.height = height;
        this.label = null;
        this.node = null;
        this.paddingCircles = paddingCircles;
        this.width = width;

        // condition data
        this.dataFormatted = this.data;
        this.nodes = this.dataFormatted ? [...new Set(this.dataFormatted.leaves().map(d => this.extractLabel(d.data)))].sort((a,b) => a.toLowerCase().localeCompare(b.toLowerCase())) : null;

        // using font size as the base unit of measure make responsiveness easier to manage across devices
        this.artboardUnit = typeof window === "undefined" ? 16 : parseFloat(getComputedStyle(document.body).fontSize);

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
                .parentId(d => d.id.substring(0, d.id.lastIndexOf(this.delimeter)));

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
            .attr("data-node-label", d => this.extractLabel(d))
            .attr("data-node-depth", d => d.depth)
            .attr("data-node-children", d => d.children ? true : false)
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
            .attr("data-node-children", d => d.children ? true : false)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .on("click", (e,d) => {

                // node label
                let label = this.extractLabel(d);

                // update class
                document.querySelectorAll(`[data-node-label="${label}"]`).forEach(d => d.classList.toggle("selected"));

                // send event to parent
                this.artboard.dispatch("nodeclick", {
                    bubbles: true,
                    detail: {
                        label: label
                    }
                });

            })
            .on("mouseover", (e,d) => {

                // node label
                let label = this.extractLabel(d);

                // update class
                document.querySelectorAll(`[data-node-label="${label}"]`).forEach(d => d.classList.add("active"));

                // send event to parent
                this.artboard.dispatch("nodemouseover", {
                    bubbles: true,
                    detail: {
                        label: label,
                        xy: [e.clientX + (this.artboardUnit / 2), e.clientY + (this.artboardUnit / 2)]
                    }
                });

            })
            .on("mouseout", (e,d) => {

                // node label
                let label = this.extractLabel(d);

                // update class
                document.querySelectorAll(`[data-node-label="${label}"]`).forEach(d => d.classList.remove("active"));

                // send event to parent
                this.artboard.dispatch("nodemouseout", {
                    bubbles: true,
                    detail: {
                        label: label
                    }
                });

            });
    }

    /**
     * Extract label from full hierarchy path.
     * @param {object} d - datum inside d3 data
     * @returns A string which represents the label for a node.
     */
    extractLabel(d) {
        return d.id.split(this.delimeter)[d.id.split(this.delimeter).length - 1];
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
        this.artboard = this.generateArtboard(domNode);

        // generate nodes
        this.node = this.generateNodes(this.artboard);

        // position/style nodes
        this.configureNodes();

        // generate text label
        this.label = this.generateLabels(this.artboard);

        // position/style labels
        this.configureLabels();

    }

};

export { PackedCircles };
export default PackedCircles;

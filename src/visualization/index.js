import { pack, stratify } from "d3-hierarchy";
import { interpolateHcl } from "d3-interpolate";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";

import { configurationDimension, configurationLayout, configurationParse } from "../configuration.js";
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
        this.paddingCircles = paddingCircles;
        this.width = width;

        // condition data
        this.dataFormatted = this.data;
        this.nodes = this.dataFormatted ? this.dataFormatted.leaves().map(d => Object.assign({ id: d.data.id })) : null;

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
        return pack()
            .size([this.width, this.height])
            .padding(this.paddingCircles);
    }

    /**
     * Construct style.
     * @returns A d3 color function.
     */
    get style() {
        return scaleLinear()
            .domain([0, 5])
            .range(["hsl(20,0%,80%)", "hsl(200,30%,40%)"])
            .interpolate(interpolateHcl);
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
     * Render visualization.
     * @param {node} domNode - HTML node
     */
    render(domNode) {

        // generate svg artboard
        let artboard = select(domNode)
            .append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("class", "lgv-packed-circles");

        // generate nodes
        let node = artboard
            .selectAll("circle")
            .data(this.dataFormatted ? this.dataFormatted.descendants() : [])
            .enter()
            .append("circle");

        // position/style nodes
        node
            .attr("class", "lgv-node")
            .attr("id", d => this.extractLabel(d))
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r)
            .attr("fill", d => d.children ? this.style(d.depth) : "white")
            .style("cursor", "pointer")
            .on("mouseover", e => {
                // set node
                node.attr("opacity", x =>  mouseOverIds(e.target.id, this.dataSource).includes(x.id) ? 1 : 0.15);
                // set labels
                label.attr("opacity", x => mouseOverIds(e.target.id, this.dataSource).includes(x.id) ? 1 : 0.15);
            })
            .on("mouseout", e => {
                // reset nodes
                node.attr("opacity", 1);
                // reset labels
                label.attr("opacity", 1);
            });

        // generate text label
        const label = artboard
            .selectAll("text")
            .data(this.dataFormatted ? this.dataFormatted.descendants() : [])
            .enter()
            .append("text");

        // position/style labels
        label
            .attr("class", "lgv-label")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .text(d => this.extractLabel(d));

    }

};

export { PackedCircles };
export default PackedCircles;

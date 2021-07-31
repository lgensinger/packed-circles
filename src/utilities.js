import { configurationParse } from "./configuration.js";

/**
 * Mouse over to toggle attributes across node collections.
 * @param {array} data - objects where each represents discrete datum
 * @param {array} selected - each item is a string where each represents a node label
 * @returns An array of strings where each represents a node or link id which matches the active item.
 */
function mouseOverIds(selected, data) {

    let ids = [];

    // generate list of links/nodes match id
    let matches = [];

    // loop through selected node labels
    for (const label of selected) {

        // filter for matches
        matches = matches.concat(data.filter(d => d.id.includes(label)).map(d => d.id).flat());

    }

    // loop through matching items
    matches.forEach(hierarchyPath => {

        // get discrete items in hierarchy path
        let hierarchyList = hierarchyPath.split(configurationParse.delimeter);

        // track the paths already assembled
        let tracked = [];

        // loop through discrete items
        for (const item of hierarchyList) {

            // construct path based off tracked progress
            let val = tracked.length > 0 ? `${tracked[tracked.length - 1]}${configurationParse.delimeter}${item}` : item;

            // add to collection of items for interaction
            ids.push(val);

            // add constructed path to tracked list
            tracked.push(val);

        }

    });

    return ids;

}

export { mouseOverIds };
export default mouseOverIds;

import { name } from "../package.json";

const configuration = {
    name: name.replace("/", "-").slice(1)
};

const configurationDimension = {
    height: process.env.DIMENSION_HEIGHT || 600,
    width: process.env.DIMENSION_WIDTH || 600
}

const configurationLayout = {
    paddingCircles: process.env.LAYOUT_PADDING_CIRCLES || 10
}

const configurationParse = {
    delimeter: process.env.PARSE_DELIMETER || "|"
}

export { configuration, configurationDimension, configurationLayout, configurationParse };
export default configuration;

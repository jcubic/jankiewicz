const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    eleventyConfig.setTemplateFormats([
        "md"
    ]);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy({ "static": "." });
};

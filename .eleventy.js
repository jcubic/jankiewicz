const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const abbr = require("markdown-it-abbr");

module.exports = function(eleventyConfig) {
    eleventyConfig.setTemplateFormats([
        "md"
    ]);
    const options = {
        html: true,
        linkify: true
    };
    const md = markdownIt(options).use(abbr);
    eleventyConfig.setLibrary("md", md);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy({ "static": "." });
};

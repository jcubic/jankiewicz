module.exports = function(eleventyConfig) {
    eleventyConfig.setTemplateFormats([
        "md"
    ]);
    eleventyConfig.addPassthroughCopy({ "static": "." });
};

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
    eleventyConfig.addCollection("articleSets", function(collectionApi) {
        const collections = collectionApi.getAll();
        return collections.reduce((result, template) => {
            if (!Array.isArray(template.data.tags)) {
                return result;
            }
            const tag = template.data.tags.find(key => key.startsWith("articles_"));
            if (tag) {
                result.push(tag);
            }
            return result;
        }, []);
    });
};

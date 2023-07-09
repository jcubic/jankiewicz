const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const abbr = require("markdown-it-abbr");
const { minify } = require('html-minifier-terser');

function filter_tags(collectionApi, filter_callback) {
    const collections = collectionApi.getAll();
    return collections.reduce((result, template) => {
        if (!Array.isArray(template.data.tags)) {
            return result;
        }
        const tag = template.data.tags.find(filter_callback);
        if (tag && !result.includes(tag)) {
            result.push(tag);
        }
        return result;
    }, []);
}

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
        return filter_tags(collectionApi, key => key.startsWith("articles_"));
    });
    eleventyConfig.addCollection("langs", function(collectionApi) {
        return filter_tags(collectionApi, key => key.startsWith("index_")).map(tag => {
            return tag.replace(/index_/, '');
        });
    });
    eleventyConfig.addTransform("minification", async function(content) {
        const path = this.page.outputPath;
        if (path.endsWith('.html')) {
            return htmlTerser(content, {
                collapseWhitespace: true
            });
        }
        return content; // no change done.
    });
};

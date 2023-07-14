const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const abbr = require('markdown-it-abbr');
const { minify } = require('html-minifier-terser');
const { encode } = require('html-entities');
const crc32 = require('./crc32');
const fs = require('fs/promises');

const dev = process.env.ELEVENTY_RUN_MODE !== 'build';

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
    const options = {
        html: true,
        linkify: true
    };

    const md = markdownIt(options).use(abbr);
    eleventyConfig.setLibrary('md', md);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy({ 'static': '.' });

    eleventyConfig.addCollection('articleSets', function(collectionApi) {
        return filter_tags(collectionApi, key => key.match(/articles_|pages_/));
    });

    eleventyConfig.addCollection('langs', function(collectionApi) {
        return filter_tags(collectionApi, key => key.startsWith('index_')).map(tag => {
            return tag.replace(/index_/, '');
        });
    });

    eleventyConfig.addAsyncFilter('has_code', async page => {
        const md = await fs.readFile(page.inputPath, 'utf8');
        return /```./.test(md);
    });

    eleventyConfig.addFilter('dump', obj => {
        console.log({obj});
        if (obj) {
            return JSON.stringify(Object.keys(obj), null, 2);
        }
    });

    eleventyConfig.addFilter('translation', (collection, title) => {
        return collection.filter(page => {
            if (page.data.title?.startsWith(title)) {
                return true;
            }
            if (page.data.en?.startsWith(title)) {
                return true;
            }
            return false;
        }).sort((a, b) => {
            return a.data.lang.localeCompare(b.data.lang);
        });
    });

    // ref: https://syntackle.live/blog/eleventy-shortcode-for-embedding-codepen-ZyslIPzCHpJo3kkPwu2U/
    eleventyConfig.addLiquidShortcode('codepen', function (url) {

        const url_array = url.split('/');

        const profile_url_array = url_array.filter((string, index) => {
            return (index < (url_array.length - 2)) ? true : false
        })

        const username = profile_url_array[profile_url_array.length - 1];
        const user_profile = profile_url_array.join('/');
        const data_slug_hash = url_array[url_array.length - 1];

        return `<p class="codepen" data-height="600" data-default-tab="result" data-slug-hash="${data_slug_hash}" data-user="${username}" style="height: 571px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;"><span><a href="${url}">See the pen</a> (<a href="${user_profile}">@${username}</a>) on <a href="https://codepen.io">CodePen</a>.</span></p><script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>`;
    });

    eleventyConfig.addFilter('md', function(content) {
        return md.render(content).trim().replace(/(^<p>)|(<\/p>$)/g, '');
    });

    eleventyConfig.addAsyncShortcode('with_hash', async function(filename) {
        const content = await fs.readFile(`./static/${filename}`, 'utf8');
        const hash = crc32(content);
        return `${filename}?${hash}`;
    });

    eleventyConfig.addFilter('intro', function(content) {
        const m = content.match(/^([\s\S]+)<!-- more -->/);
        if (m) {
            return m[1].trim();
        }
        return content;
    });

    eleventyConfig.addFilter('xml_escape', function(str) {
        return encode(str, {level: 'xml'});
    });

    eleventyConfig.addFilter('lastDate', function(collection) {
        if (!collection || !collection.length) {
            return emptyFallbackDate || new Date();
        }

        return new Date(Math.max(...collection.map(item => {return item.date})));
    });

    eleventyConfig.addFilter('rtrim', str => str.replace(/\s+$/, ''));

    eleventyConfig.addTransform('minification', async function(content) {
        if (dev) {
            return content;
        }
        const path = this.page.outputPath;
        if (path.endsWith('.html')) {
            return minify(content, {
                collapseWhitespace: true
            });
        }
        return content; // no change done.
    });

    eleventyConfig.addGlobalData('site', {
        url: 'https://jakub.jankiewicz.org'
    });

    return {
        dev
    };
};

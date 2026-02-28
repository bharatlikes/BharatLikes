const { DateTime } = require('luxon');
const sitemapPlugin = require('@quasibit/eleventy-plugin-sitemap');
const htmlmin = require('html-minifier-terser');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('style.css');
  eleventyConfig.addPassthroughCopy('styles.css');
  eleventyConfig.addPassthroughCopy('script.js');
  eleventyConfig.addPassthroughCopy('admin');
  eleventyConfig.addPassthroughCopy('robots.txt');

  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy');
  });

  eleventyConfig.addCollection('blog', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('content/blog/*.md')
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (
      process.env.NODE_ENV === 'production' &&
      outputPath &&
      outputPath.endsWith('.html')
    ) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });
    }
    return content;
  });

  eleventyConfig.addPlugin(sitemapPlugin, {
    sitemap: {
      hostname: 'https://yourdomain.com',
    },
  });

  return {
    dir: {
      input: '.',
      includes: '_includes',
      output: '_site',
    },
  };
};

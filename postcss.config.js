module.exports = {
  plugins: [
    require('postcss-import')({
      plugins: [
        require('stylelint')({
          configFile: './.stylelintrc.json',
        }),
      ],
    }),
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 1,
      browsers: 'last 2 versions',
      autoprefixer: { grid: true },
      features: { 'nesting-rules': false },
    }),
    require('postcss-reporter')({ clearReportedMessages: true }),
    require('cssnano'),
  ],
};

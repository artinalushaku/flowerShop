export default {
    default: {
        requireModule: ['ts-node/register'],
        require: [
            './step_definitions/**/*.steps.js',
            './support/hooks.js'
        ],
        paths: [
            './features/**/*.feature'
        ],
        format: ['progress-bar', '@cucumber/pretty-formatter'],
        formatOptions: { snippetInterface: 'async-await' },
        publishQuiet: true,
        parallel: 1
    }
} 
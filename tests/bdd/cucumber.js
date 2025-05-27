export default {
    default: {
        require: [
            './step_definitions/anetari1/*.steps.js'
        ],
        paths: [
            './features/anetari1/*.feature'
        ],
        format: ['progress-bar', 'html:cucumber-report.html'],
        formatOptions: { snippetInterface: 'async-await' },
        publishQuiet: true
    }
} 
import typescript from 'rollup-plugin-typescript';
import del from 'rollup-plugin-delete';
import pkg from './package.json';
import scss from 'rollup-plugin-scss';

export default [
    {
        input: 'src/index.ts',  //we are telling rollup to take this path as an input
        output: [
            {
                file: 'playground/src/component-lib/index.js',
                format: 'esm',
                banner: '/* eslint-disable */',
            },
            { file: pkg.main, format: 'cjs' },  //CommonJs format
            { file: pkg.module, format: 'esm' },  //EsModules format
        ],
        plugins: [
            del({
                targets: ['dist/*', 'playground/src/component-lib'],
            }),
            typescript(),
            scss({
                // Choose *one* of these possible "output:..." options
                // Default behaviour is to write all styles to the bundle destination where .js is replaced by .css
                output: true,

                // Filename to write all styles to
                output: 'bundle.css',

                // Callback that will be called ongenerate with two arguments:
                // - styles: the contents of all style tags combined: 'body { color: green }'
                // - styleNodes: an array of style objects: { filename: 'body { ... }' }
                output: function (styles, styleNodes) {
                    writeFileSync('bundle.css', styles)
                },

                // Disable any style output or callbacks, import as string
                output: false,

                // Choose files to include in processing (default: ['/**/*.css', '/**/*.scss', '/**/*.sass'])
                include: [],

                // Choose files to exclude from processing, (default: undefined) 
                exclude: [],

                // Determine if node process should be terminated on error (default: false)
                failOnError: true,

                // Prefix global scss. Useful for variables and mixins.
                prefix: `@import "./fonts.scss";`,

                // Use a node-sass compatible compiler (default: node-sass)
                sass: require('sass'),

                // Run postcss processor before output
                processor: css => postcss([autoprefixer({ overrideBrowserslist: "Edge 18" })]),

                // Process resulting CSS
                processor: css => css.replace('/*date*/', '/* ' + new Date().toJSON() + ' */'),

                // Add file/folder to be monitored in watch mode so that changes to these files will trigger rebuilds.
                // Do not choose a directory where rollup output or dest is pointed to as this will cause an infinite loop
                watch: 'src/styles/components',
                watch: ['src/styles/components', 'src/multiple/folders'],
            })
        ],
        external: Object.keys(pkg.peerDependencies || {})
    },
];
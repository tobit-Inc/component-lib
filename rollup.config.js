import typescript from 'rollup-plugin-typescript';
import del from 'rollup-plugin-delete';
import pkg from './package.json';

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
        ],
        external: Object.keys(pkg.peerDependencies || {})
    },
];
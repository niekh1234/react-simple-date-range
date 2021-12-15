import ts from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        name: 'react-simple-date-range',
      },
      {
        file: pkg.module,
        format: 'esm',
        name: 'react-simple-date-range',
      },
    ],
    plugins: [commonjs(), resolve(), ts(), postcss({ plugins: [autoprefixer()] }), terser()],
    external: ['react', 'react-dom'],
  },
];

// rollup.config.js
import babel from 'rollup-plugin-babel'

const name = 'CSVExportService'

export default {
  input: `src/${name}.js`,
  output: [
    {
      file: `dist/${name}.js`,
      format: 'umd',
      name: name,
      sourcemap: true,
    },
    {
      file: `lib/${name}.js`,
      format: 'cjs',
      name: name,
      sourcemap: true,
    },
    {
      file: `module/${name}.js`,
      format: 'esm',
      name: name,
      sourcemap: true,
    },
  ],
  plugins: [
    babel(),
  ],
}

import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const name = require('./package.json').main.replace(/\.js$/, '')

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
})

const outputConfig = {
  preserveModules: true,
  sourcemap: true,
  dir: 'dist',
}

export default [
  bundle({
    plugins: [
      esbuild({
        jsx: 'automatic',
      }),
    ],
    output: [
      {
        ...outputConfig,
        format: 'cjs',
      },
      {
        ...outputConfig,
        format: 'es',
        entryFileNames: '[name].mjs',
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
]


// https://custom-elements-manifest.open-wc.org/analyzer/config/#cli-options
export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  outdir: 'dist',
  dev: true,
  watch: false,
  dependencies: true,
  packagejson: true,  /** Output CEM path to `package.json`, defaults to true */
  litelement: true,

}

// https://custom-elements-manifest.open-wc.org/analyzer/config/#cli-options
export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  outdir: './',
  dev: false,
  watch: false,
  dependencies: false,
  litelement: true,

}
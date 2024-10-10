import { defineConfig } from 'vite';
// import postcssLit from 'rollup-plugin-postcss-lit';
// import basicSsl from '@vitejs/plugin-basic-ssl' // uncomment for HTTPS

export default defineConfig(({ command, mode }) => {
  const server = mode === "development"
    ? {
        server: {
          host: "0.0.0.0",
        }
      }
    : {};

  const build = mode === "development"
    ? {
        build: {
          minify: false,
          cssCodeSplit: true,
          cssMinify: false
        }
      }
    : {
        build: {
          target: "esnext"
        }
      };



  return {
    ...build,
    ...server,
    plugins: [],
  }
})

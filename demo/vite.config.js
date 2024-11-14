import { defineConfig } from 'vite';
// import postcssLit from 'rollup-plugin-postcss-lit';
// import basicSsl from '@vitejs/plugin-basic-ssl' // uncomment for HTTPS

export default defineConfig(({ command, mode }) => {

  const cspPolicy =
  "base-uri 'self' ; " +
  "object-src 'none' ; " +
  "default-src 'self' ; " +
  "connect-src 'self' http: https: ; " +
  "script-src 'nonce-rand0m' 'strict-dynamic' http: https: ; " +
  "style-src 'self' 'nonce-rand0m' ; " +
  "font-src 'self' ; " +
  "img-src 'self' data: ; " +
  "child-src 'self' ; " +
  "frame-src 'self';" +
  "frame-ancestors 'self';"


  const server = mode === "development"
    ? {
      server: {
        host: "0.0.0.0",
        headers: {'Content-Security-Policy': cspPolicy}
      }
    }
    : {};


  const build = mode === "development"
    ? {
        build: {
          minify: true,
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
    plugins: [
      {
        name: "html-inject-nonce-into-script-tag",
        enforce: "post",
        transformIndexHtml(html) {
          const regex = /<(link|style|script)(.*?)/gi;
          const replacement = mode === "development" ? '<$1 nonce="rand0m"$2' : '<$1 nonce="{{cspNonce}}"$2';
          const htmlWithTags =  html.replace(regex, replacement);
          return mode === "development" ? htmlWithTags.replace(/({{cspNonce}})/gi, "rand0m") : htmlWithTags;
        },
      },
    ],
  }
})

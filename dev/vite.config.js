import { defineConfig } from 'vite';
import postcssLit from 'rollup-plugin-postcss-lit';
import { hmrPlugin, presets } from 'vite-plugin-web-components-hmr';
// import basicSsl from '@vitejs/plugin-basic-ssl' // uncomment for HTTPS

export default defineConfig(({ command, mode }) => {
  const server =
    mode === 'development'
      ? {
          server: {
            host: '0.0.0.0',
            headers: {
              'Content-Security-Policy': `style-src 'nonce-rand0m' 'self'`,
            },
          },
        }
      : {};

  const build =
    mode === 'development'
      ? {
          build: {
            minify: false,
            cssCodeSplit: true,
            cssMinify: false,
          },
        }
      : {
          build: {
            target: 'esnext',
          },
        };


  return {
    ...build,
    ...server,

    plugins: [
      hmrPlugin({
        include: ['../src/**/*.ts'],
        presets: [presets.lit],
      }),
      // basicSsl(), // uncomment for HTTPS
      postcssLit(),
      {
        name: 'html-inject-nonce-into-script-tag',
        enforce: 'post',
        transformIndexHtml(html) {
          const regex = /<(link|style|script)(.*?)/gi;
          const replacement =
            mode === 'development'
              ? '<$1 nonce="rand0m"$2'
              : '<$1 nonce="{{cspNonce}}"$2';
          const htmlWithTags = html.replace(regex, replacement);
          return mode === 'development'
            ? htmlWithTags.replace(/({{cspNonce}})/gi, 'rand0m')
            : htmlWithTags;
        },
      },
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        src: '/src',
        components: '/src/components',
        mixins: '/src/mixins',
        internal: '/src/internal',
      },
    },
  };
});

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    mdx({
      remarkPlugins: [
        [remarkFrontmatter, { type: 'yaml', marker: '-' }],
      ],
      rehypePlugins: [
        rehypeUnwrapImages,
      ],
      shikiConfig: {
        theme: 'github-dark',
        wrap: true,
      },
      optimize: true,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        'motion-sensors-polyfill': '/node_modules/motion-sensors-polyfill/src/motion-sensors.js',
      },
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
            'vendor-ui': ['@headlessui/react'],
            'vendor-animation': ['@lottiefiles/react-lottie-player'],
          },
        },
      },
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    // Enable Tailwind CSS v4 via Vite plugin
    plugins: [
      tailwindcss(),
      ViteImageOptimizer({
        webp: {
          quality: 85,
          lossless: false
        }
      }),
    ],
  },
  // Set base path from environment variable
  base: process.env.VITE_BASE_PATH || '/',
  // Enable static site generation
  output: 'static',
  // Build configuration
  build: {
    assets: 'assets',
  },
});
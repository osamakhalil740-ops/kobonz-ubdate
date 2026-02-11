import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // Gzip compression
        viteCompression({
          verbose: false,
          disable: false,
          threshold: 5120, // Compress files > 5KB for better mobile performance
          algorithm: 'gzip',
          ext: '.gz',
          deleteOriginFile: false,
        }),
        // Brotli compression (better than gzip)
        viteCompression({
          verbose: false,
          disable: false,
          threshold: 5120, // Compress files > 5KB
          algorithm: 'brotliCompress',
          ext: '.br',
          deleteOriginFile: false,
        }),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      assetsInclude: ['**/*.json'],
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        copyPublicDir: true,
        cssMinify: true,
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Vendor chunks - separate large dependencies
              if (id.includes('node_modules')) {
                if (id.includes('firebase')) {
                  return 'vendor-firebase';
                }
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                if (id.includes('react-router')) {
                  return 'vendor-router';
                }
                if (id.includes('@heroicons')) {
                  return 'vendor-icons';
                }
                if (id.includes('recharts')) {
                  return 'vendor-charts';
                }
                if (id.includes('mixpanel') || id.includes('posthog') || id.includes('@sentry')) {
                  return 'vendor-analytics';
                }
                if (id.includes('qrcode')) {
                  return 'vendor-qrcode';
                }
                return 'vendor-other';
              }
              
              // Location data chunks
              if (id.includes('utils/locationData/')) {
                const continent = id.split('locationData/')[1]?.split('.')[0];
                if (continent) {
                  return `location-${continent}`;
                }
              }
              
              // Dashboard chunks - separate large pages
              if (id.includes('pages/')) {
                if (id.includes('SuperAdminDashboard')) {
                  return 'page-super-admin';
                }
                if (id.includes('ShopOwnerDashboard')) {
                  return 'page-shop-owner';
                }
                if (id.includes('AffiliateDashboard')) {
                  return 'page-affiliate';
                }
                if (id.includes('AdminDashboard')) {
                  return 'page-admin';
                }
                if (id.includes('MarketplacePage')) {
                  return 'page-marketplace';
                }
                if (id.includes('HomePage')) {
                  return 'page-home';
                }
              }
              
              // Component chunks - split heavy components
              if (id.includes('components/')) {
                if (id.includes('DashboardCharts') || id.includes('AdvancedAnalytics')) {
                  return 'component-charts';
                }
                if (id.includes('AdminUserManagement') || id.includes('RealTimeActivityFeed')) {
                  return 'component-admin';
                }
              }
              
              // Services chunk
              if (id.includes('services/')) {
                return 'services';
              }
              
              // Utils chunk
              if (id.includes('utils/') && !id.includes('locationData')) {
                return 'utils';
              }
            },
            format: 'es',
            hoistTransitiveImports: false,
            // Optimize chunk names for better caching
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
          external: [],
          preserveEntrySignatures: 'strict'
        },
        commonjsOptions: {
          include: [/node_modules/],
          transformMixedEsModules: true,
        },
        target: 'es2020',
        sourcemap: false, // Disable sourcemaps in production for smaller bundle
        // Optimize chunk size for mobile - smaller chunks for better loading
        chunkSizeWarningLimit: 400,
        reportCompressedSize: false, // Disable to speed up build
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.logs in production
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
            passes: 2, // Multiple passes for better compression
            unsafe_arrows: true,
            unsafe_methods: true,
          },
          format: {
            comments: false, // Remove all comments
          },
          mangle: {
            safari10: true, // Better Safari support
          },
        }
      }
    };
});

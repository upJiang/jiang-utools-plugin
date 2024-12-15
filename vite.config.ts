import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#": fileURLToPath(new URL("./types", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    viteMockServe(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        {
          name: "copy-files",
          writeBundle() {
            const filesToCopy = [
              { src: "plugin.json", dest: "dist" },
              { src: "logo.jpg", dest: "dist" },
            ];
            filesToCopy.forEach(({ src, dest }) => {
              const srcPath = path.resolve(__dirname, src);
              const destPath = path.resolve(
                __dirname,
                dest,
                path.basename(src),
              ); // 保持原文件名

              // 复制文件
              fs.copyFileSync(srcPath, destPath);
              console.log(`Copied ${src} to ${destPath}`);
            });
          },
        },
      ],
    },
  },
  server: {
    open: true,
    port: 7777,
    strictPort: true,
    // 设置代理示例
    proxy: {
      "/XXApi": "https://blog.junfeng530.xyz/",
    },
  },
});

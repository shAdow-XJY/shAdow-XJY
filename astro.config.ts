// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

const BASE = '/shAdow-XJY/';

export default defineConfig({
    base: BASE,
    site: 'https://shAdow-XJY.github.io/shAdow-XJY/',
    output: 'static',
    integrations: [react(), tailwind()],
    vite: {
        plugins: [
            {
                name: 'astro-public-base-rewrite',
                configureServer(server) {
                    // Astro dev server 请求 /shAdow-XJY/images/xxx 时
                    // Vite 内部去掉 base 前缀再匹配 public 目录
                    // 但如果请求的是 /images/xxx（不带 base），Vite 匹配不到 public
                    // 此中间件：去掉 base 后缀，让 Vite 能匹配到 public 资源
                    server.middlewares.use((req, res, next) => {
                        const url = req.url ?? '';
                        if (url.startsWith(BASE)) {
                            req.url = url.slice(BASE.length - 1); // /shAdow-XJY/images/ → /images/
                        }
                        next();
                    });
                },
            },
        ],
    },
});

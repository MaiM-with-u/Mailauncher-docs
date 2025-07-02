import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MaiLauncher 文档',
  description: 'MaiLauncher 启动器的官方文档',
  
  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '用户指南', link: '/guide/' },
      { text: '开发文档', link: '/dev/' },
      { text: 'API参考', link: '/api/' }
    ],

    // 侧边栏
    sidebar: {
      '/guide/': [
        {
          text: '用户指南',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '安装配置', link: '/guide/installation' },
            { text: '基本使用', link: '/guide/basic-usage' },
            { text: '高级功能', link: '/guide/advanced' },
            { text: '常见问题', link: '/guide/faq' }
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发文档',
          items: [
            { text: '开发概述', link: '/dev/' },
            { text: '项目结构', link: '/dev/structure' },
            { text: '构建部署', link: '/dev/build' },
            { text: '贡献指南', link: '/dev/contributing' },
            { text: 'GitHub Actions', link: '/dev/github-actions' }
          ]
        },
        {
          text: '前端开发',
          items: [
            { text: 'send_message 实现', link: '/dev/frontend-sendmessage' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: 'API 概述', link: '/api/' },
            { text: '启动器 API', link: '/api/launcher' },
            { text: 'WebSocket API', link: '/api/websocket' },
            { text: '配置 API', link: '/api/config' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MaiM-with-u/Mailauncher-docs' }
    ],

    // 页脚
    footer: {
      message: '基于 GPL-3.0 许可证发布',
      copyright: 'Copyright © 2025 MaiLauncher Team'
    },

    // 搜索
    search: {
      provider: 'local'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/MaiM-with-u/Mailauncher-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  },

  // 语言配置
  lang: 'zh-CN',
  
  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }]
  ],

  // 清理 URL
  cleanUrls: true,

  // Markdown 配置
  markdown: {
    lineNumbers: true
  }
})

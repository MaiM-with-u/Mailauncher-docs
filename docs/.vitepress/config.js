import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MaiLauncher 文档',
  description: 'MaiLauncher 启动器的官方文档',
  
  // 基础路径配置 - 设置为根路径
  base: '/',
  
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
            { text: '基本使用', link: '/guide/basic-usage' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 文档',
          items: [
            { text: 'API 概览', link: '/api/' },
            { text: 'API 参考', link: '/api/reference' },
            { text: '开发指南', link: '/api/development' }
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发文档',
          items: [
            { text: '开发概述', link: '/dev/' },
            { text: '项目架构', link: '/dev/architecture' },
            { text: '部署指南', link: '/dev/deployment' },
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
  
  // 忽略死链接检查（临时解决方案）
  ignoreDeadLinks: true,
  
  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c82f6' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],

  // 清理 URL
  cleanUrls: true,

  // Markdown 配置
  markdown: {
    lineNumbers: true
  }
})

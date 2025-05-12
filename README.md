# CrewAI Flows 前端

## 项目简介
本项目为 CrewAIFlowsFullStack 的前端部分，基于 React 实现，支持与后端 API 对接，实现需求提交、作业进度轮询和结果展示。

## 目录结构
```
crewaiFlowsFrontend/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── CrewForm.jsx
│   ├── JobStatus.jsx
│   ├── api.js
│   └── index.js
├── package.json
└── README.md
```

## 安装依赖
```bash
cd crewaiFlowsFrontend
npm install
```

## 启动开发服务器
```bash
npm start
```

## 生产环境打包
```bash
npm run build
```

## 说明
- 默认接口地址为 `/api/crew`，如需跨域请配置代理或调整后端CORS。
- 推荐与 crewaiFlowsBackend 一起运行。 
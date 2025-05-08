# 3D宝可梦世界

这是一个基于Three.js的3D宝可梦捕捉游戏。在这个游戏中，你可以在3D世界中探索、攻击和捕捉宝可梦。

## 游戏特点

- 实时3D环境，包含树木、岩石和地形
- 第一人称视角控制
- 10只不同的宝可梦同时存在于游戏世界中
- 超过50种可捕捉的宝可梦
- 基于物理的精灵球投掷机制
- 宝可梦捕获系统
- 背包系统管理已捕获的宝可梦

## 操作方法

- **WASD**: 移动
- **鼠标**: 视角控制
- **鼠标左键**: 攻击宝可梦
- **鼠标右键**: 投掷精灵球
- **B键**: 打开/关闭背包
- **空格键**: 跳跃

## 游戏玩法

1. 使用WASD和鼠标在游戏世界中移动
2. 找到宝可梦，先用鼠标左键攻击减弱它们
3. 当宝可梦生命值较低时，用鼠标右键投掷精灵球捕捉
4. 按B键查看已捕获的宝可梦

## 技术栈

- HTML5
- CSS3
- JavaScript
- Three.js

## 在线游玩

你可以访问以下链接在线游玩这个游戏:
[3D宝可梦世界](https://yoyoka123.github.io/pokemon_gemini/)

## 项目结构

```
pokemon_gemini/
├── index.html       # 主HTML文件
├── style.css        # 样式表
├── js/              # JavaScript文件
│   ├── game.js      # 游戏主逻辑
│   ├── world.js     # 游戏世界
│   ├── player.js    # 玩家控制
│   ├── pokemon.js   # 宝可梦类
│   ├── bag.js       # 背包系统
│   └── models.js    # 模型加载工具
├── models/          # 3D模型文件
└── textures/        # 贴图文件
    ├── pokemon/     # 宝可梦图像
    └── skybox/      # 天空盒贴图
```

## 技术说明

本游戏使用以下技术构建：

- Three.js - 3D渲染引擎
- GLTFLoader - 加载3D模型
- PointerLockControls - 第一人称控制

## 如何运行

1. 确保你有一个支持WebGL的现代浏览器
2. 克隆或下载此仓库
3. 使用本地服务器运行项目（例如使用Python的`http.server`或Node.js的`http-server`）
4. 在浏览器中打开项目

```bash
# 例如使用Python创建本地服务器
python -m http.server
# 然后在浏览器访问 http://localhost:8000
``` 
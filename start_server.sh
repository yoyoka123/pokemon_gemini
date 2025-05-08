#!/bin/bash

echo "启动宝可梦3D游戏本地服务器..."

# 检查Python版本
if command -v python3 &>/dev/null; then
    echo "使用Python 3启动服务器..."
    python3 -m http.server 8000
elif command -v python &>/dev/null; then
    echo "使用Python启动服务器..."
    python -m http.server 8000
elif command -v npx &>/dev/null; then
    echo "使用http-server启动服务器..."
    npx http-server -p 8000
else
    echo "错误：未找到Python或NPM/http-server。"
    echo "请安装Python 3或Node.js后再试。"
    exit 1
fi

echo "服务器已启动，请在浏览器中访问 http://localhost:8000" 
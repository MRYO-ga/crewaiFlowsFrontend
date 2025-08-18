#!/bin/bash

echo "Starting deployment process..."

# 进入项目目录
cd /home/code/crewaiFlowsFrontend/

# 拉取最新代码
echo "Pulling latest code from git..."
git pull origin master

# 安装依赖
# echo "Installing dependencies..."
# npm install

# 构建项目
echo "Building project..."
npm run build

# 备份当前版本
echo "Backing up current version..."
sudo cp -r /var/www/crewai /var/www/crewai.backup_$(date +%Y%m%d)

# 复制新的构建文件
echo "Copying new build files..."
sudo cp -r build/* /var/www/crewai/

# 设置权限
echo "Setting permissions..."
sudo chown -R nginx:nginx /var/www/crewai
sudo chmod -R 755 /var/www/crewai

# 重新加载 Nginx
echo "Reloading Nginx..."
sudo nginx -s reload

echo "Deployment completed!"

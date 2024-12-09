FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/node:18-alpine
# 设置工作目录
WORKDIR /app
# 复制包管理文件
COPY package*.json ./
# 安装依赖
RUN npm install
# 复制源代码
COPY . .
# 构建生产版本
RUN npm run build
# 暴露端口
EXPOSE 3000
# 使用 preview 运行生产版本
CMD ["npm", "run", "dev"]

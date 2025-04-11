# Stage 1: Dependencies
FROM node:22.6.0-alpine3.20 AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --prefer-offline --frozen-lockfile --production --no-audit --silent

# Stage 2: Builder
FROM node:22.6.0-alpine3.20 AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 验证输出目录结构（调试用）
RUN yarn build && \
    ls -a .next && \
    ls -a .next/standalone

# Stage 3: Runner
FROM node:22.6.0-alpine3.20 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# 修复路径：复制完整的 standalone 目录内容
COPY --from=builder /app/.next/standalone ./

EXPOSE 3000

# 确认启动文件存在（调试用）
RUN ls -lh server.js || (echo "Missing server.js" && exit 1)

CMD ["node", "server.js"]

# Stage 4: Nginx
FROM nginx:1.27.0-alpine3.19 AS nginx

COPY --from=builder /app/public /usr/share/nginx/html
COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
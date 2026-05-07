FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
ARG REACT_APP_API_BASE=/api
ENV REACT_APP_API_BASE=$REACT_APP_API_BASE
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]

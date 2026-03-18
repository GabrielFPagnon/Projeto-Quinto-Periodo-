FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"
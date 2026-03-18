FROM node:18
WORKDDIR /app
COPY package*.json ./
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"
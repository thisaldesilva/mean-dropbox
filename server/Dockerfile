FROM node:10
WORKDIR /app
COPY package.json /server
RUN npm install
COPY . /app
EXPOSE 9000
ENTRYPOINT ["node"]
CMD ["server.js"]

#well for further development
FROM node
WORKDIR /usr/src/app
COPY package.json . 
RUN npm i -g gatsby-cli
RUN npm i
COPY gatsby-config.js .
EXPOSE 8000
CMD [ 'gatsby', 'develop', "-H", "0.0.0.0"]
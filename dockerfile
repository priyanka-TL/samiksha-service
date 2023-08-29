FROM node:16

WORKDIR /opt/samiksha

#copy package.json file
COPY package.json /opt/samiksha

#install node packges
RUN npm install && npm install -g nodemon@2.0.16

#copy all files 
COPY . /opt/samiksha/

#expose the application port
EXPOSE 4301

#start the application
CMD node app.js

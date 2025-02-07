FROM node:20

WORKDIR /opt/samiksha/

#copy package.json file
COPY package.json /opt/samiksha/package.json

#install node packges
RUN npm install 
RUN npm install -g nodemon@2.0.20

#copy all files 
COPY . /opt/samiksha

#expose the application port
EXPOSE 4301

#start the application
CMD ["node", "app.js"]

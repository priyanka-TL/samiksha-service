FROM node:20

WORKDIR /opt/samiksha/

#copy package.json file
COPY package.json .

#install node packges
RUN npm install && npm install -g nodemon@2.0.16

#copy all files 
COPY . .

#expose the application port
EXPOSE 4301

#start the application
CMD ["node", "dev"]

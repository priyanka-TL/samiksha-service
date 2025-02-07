FROM node:20

RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/samiksha/

#copy package.json file
COPY package.json /opt/samiksha/package.json

#install node packges
RUN npm install --build-from-source
RUN npm install -g nodemon@2.0.20

#copy all files 
COPY . /opt/samiksha

#expose the application port
EXPOSE 4301

#start the application
CMD ["node", "app.js"]

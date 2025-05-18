FROM node:20

# Install necessary system dependencies for canvas
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    libfreetype6-dev \
    pkg-config \
    gcc \
    g++ \
    make \
    python3
    
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

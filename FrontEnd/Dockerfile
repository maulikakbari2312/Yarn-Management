# use node version
FROM node:16

# Set working directory
WORKDIR /user/src/app

#copy package.json
COPY package*.json ./

# Install npm dependencies
RUN npm install --verbose

#Bundle app source
COPY . .

# Expose the port 
EXPOSE 7000

# Defined command to run the app
CMD [ "npm", "run", "start"]
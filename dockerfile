# Get the base image of Node version 16
FROM node:16

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:focal

#Installing playwright requirements
RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev openjdk-11-jre

#setting JAVA_HOME and Node modules in PATH
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH
ENV PATH /app/node_modules/.bin:$PATH

#setup Secret Key (crypt-js)
ARG SECRET_KEY
ENV SECRET_KEY=$SECRET_KEY

#setup variables for automation script
ENV ENV=tst
ENV BROWSER=firefox
ENV REPORT=cucumber
ENV SUITE=default-scenarios.csv

# Set up virtual display with Xvfb
# ENV DISPLAY=:99
# RUN Xvfb :99 -screen 0 1920x1080 &

# Copy the project files
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

# Run the automation script
RUN chmod +x execute.sh
CMD xvfb-run ./execute.sh "$ENV" "$BROWSER" "$REPORT"
#CMD [ "xvfb-run", "./execute.sh", "tst", "firefox", "cucumber"]

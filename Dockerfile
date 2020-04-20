# Stage 1 to build static HTML and JS
FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build
# RUN echo $(ls -ltr)


# Stage 2 to copy static HTML and JS from above stage to nginx server directory
FROM node:10
COPY --from=build-stage /app/server/ /app
COPY --from=build-stage /app/build/ /app/build
WORKDIR /app
RUN npm install
RUN echo $(ls -ltr)
# Copy the default nginx.conf provided by tiangolo/node-frontend
EXPOSE 8080

# Start Nginx server
ENTRYPOINT ["node","server.js","prod" ]
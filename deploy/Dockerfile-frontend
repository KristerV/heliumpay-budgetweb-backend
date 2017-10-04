FROM node:8

# Just download
WORKDIR /var/www/frontend
RUN git clone https://github.com/KristerV/heliumpay-budgetweb-frontend.git .

# And run
RUN npm install
RUN npm run build
CMD npm run start
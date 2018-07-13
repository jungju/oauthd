#ref https://github.com/beerendlauwers/oauthd-docker

FROM node:6

RUN npm install -g grunt-cli
RUN npm install -g https://github.com/jungju/oauthd/tarball/master

RUN oauthd init --default
WORKDIR /default-oauthd-instance

# the front plugin was complaining restify was not installed,
# so we run npm install again here.
RUN cd ./plugins/front && npm install

# add config.js to the default oauthd instance.
ADD config.js ./

EXPOSE 6284
RUN ["oauthd", "-v"]
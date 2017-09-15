# Helium budget proposal

A Budget Proposal system for Helium Payments.

## How to run

1. Clone this repo.
1. Install dependencies: `npm install`
1. Install [docker](https://www.docker.com/) (and docker-compose).
1. Start the docker daemon with `systemctl start docker` (Linux)
4. Build the docker images: `docker-compose build` (re-run whenever Dockerfile or package.json changes)
5. Start the containers: `docker-compose up`
6. Wait until blockchain is downloaded. Check progress on [localhost:3000](http://localhost:3000/v0/core/raw-cli/blockchain/getblockcount).
7. Also run [the frontend](https://github.com/KristerV/heliumpay-budgetweb-frontend).

**Notes**

- You may need to use `sudo` with some commands.
- You may even need a reboot if you just installed docker.

# API design

```
v0                           // Alpha version, subject to constant change
GET v0/core/proposals        // all proposals
GET v0/core/proposals/:hash  // single proposal
GET v0/core/raw-cli/*        // Raw data from the cli
```

# Links

## Info

- [Dash budget stages](https://github.com/dashpay/dash/blob/master/doc/masternode-budget.md)

## Interesting dash services

- https://www.dashforcenews.com/
- http://dashmasternode.org
- https://www.dashninja.pl/masternodes.html
- https://dash-news.de/dashtv/#value=1000
- http://178.254.23.111/~pub/Dash/Dash_Info.html
- https://dashradar.com/

## API design guidelines

- http://microcosm-cc.github.io/
- http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
- https://api.github.com/
- https://docs.stormpath.com/rest/product-guide/latest/reference.html
- https://stripe.com/docs/api
- https://plaid.com/docs/api/
- https://developers.digitalocean.com/documentation/v2/
- https://developers.google.com/drive/v2/reference/#Children
- https://postgrest.com/en/v4.1/intro.html - tool

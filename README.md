# Helium budget proposal

A Budget Proposal system for Helium Payments with the Masternode functions that make sense.

## How to run

1. Clone this repo.
1. Install dependencies: `npm install`
1. Install [docker](https://www.docker.com/) (and docker-compose).
1. Start the docker daemon with `systemctl start docker` (Linux)
4. Build the docker images: `docker-compose build` (re-run whenever Dockerfile or package.json changes)
5. Start the containers: `docker-compose up`
6. Wait until blockchain is downloaded. Check progress on [localhost:3000](http://localhost:3000/v0/core/raw-cli/blockchain/getblockcount).

**Notes**

- You may need to use `sudo` with some commands.
- You may even need a reboot if you just installed docker.

This will start the app along with `dashd`. Also run [the frontend](https://github.com/KristerV/heliumpay-budgetweb-frontend).

## Development stages

A stage is basically a bunch of features. Starting with the most critical and moving down to nice to have stuff. The front-end will be developed at the same time as backend, but no extra prettyness will be added until main features are implemented (unless we find a front-end dev). The website ideally will be public throughout all of the developemnt.

- [x] **Stage 0** - Figure out theoretical stuff (this README)
- [ ] **Stage 1** - GET all info
	- [x] Proposals list
		- [x] Current Budget information
		- [x] List all proposals [new, paid, completed, failed]
		- [x] Item: Health, title, author, votes, amount(HLM/USD), payment#
		- [x] Filter list
	- [x] Proposal
		- [x] Details from dash-core
	- [x] Other
		- [x] SSL support
		- [x] Make systemd manage git and npm on restart
- [ ] **Stage 2** - Participate with generated commands
	- [x] Vote for proposal
	- [ ] Submit new proposal
- [ ] **Stage 3** - User based actions
	- [ ] User management
		- [ ] Register, Login, Edit profile
		- [ ] API key gen
		- [ ] Register your masternodes
	- [ ] Proposals list
		- [ ] Item: your vote, comments(unseen)
	- [ ] Proposal view
		- [ ] Proposal owner
			- [ ] Claim your proposal
			- [ ] Edit info
		- [ ] Description
		- [ ] Commenting
		- [ ] Unseen comments are visible
- [ ] **Stage 4** - Prettify frontend
- [ ] **Stage 5** - Informational pages
	- [ ] Front page
	- [ ] Getting started with Helium
	- [ ] How to set up a Masternode
	- [ ] Network statistics (incl. MN earnings)
	- [ ] Changelog
	- [ ] API listing
- [ ] **Stage 6** - MN Private key based actions
	- [ ] Submit your private key (encrypted)
	- [ ] Vote using a button
	- [ ] Masternodes monitoring
		- [ ] Performance / status
		- [ ] How much a masternode is earning
		- [ ] Next payment calculator
		- [ ] Incidents history
- [ ] **Stage X** - Backlog
	- Notifications (email/push/web)
	- Maintenance notice
	- Analytics (privacy respecting possibly custom solution)
		- Important for scheduled maintenance
	- Rating system like https://www.dashtreasury.org

# Questions still unanswered

- Offer pre-proposals on-site? Dash has their forum for it.
- Solution for hundreds of proposals? Dash doesn't want to lower their entry fee.
- Markdown vs. WYSIWYG?
- Is providing the email a privacy concern?
- How to have proposal owner accountable after budget allocated?

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
- [Python interface for dash-cli](https://github.com/moocowmoo/dash-budget_state)
- [Dash Central early days](https://www.dash.org/forum/threads/dashcentral-org-masternode-monitoring-and-budget-voting.5924/)

## Similar services

- https://dashvotetracker.com/
- https://www.dashcentral.org
- https://proposal.dash.org/

## Other

- https://www.dashforcenews.com/
- http://dashmasternode.org
- https://www.dashninja.pl/masternodes.html
- https://dash-news.de/dashtv/#value=1000
- http://178.254.23.111/~pub/Dash/Dash_Info.html

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

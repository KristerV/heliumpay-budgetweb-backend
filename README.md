# Helium budget proposal

A Budget Proposal system for Helium Payments with the Masternode functions that make sense.

**All of this is open for suggestions and we are looking for developers/designers to help.**

## Architecture

- Backend (Node.js)
	- Helium-core communication
	- Database for conversations
	- Public API
	- Registered user API
	- Masternode API
- Database (SQL)
- Frontend
	- Mobile first
	- Bootstrap like CSS framework
	- React.js auto-update or refresh to update?

## Development stages

A stage is basically a bunch of features. Starting with the most critical and moving down to nice to have stuff. The front-end will be developed at the same time as backend, but no extra prettyness will be added until main features are implemented (unless we find a front-end dev). The website ideally will be public throughout all of the developemnt.

- [x] **Stage 0** - Figure out theoretical stuff (this README)
- [ ] **Stage 1** - GET all info
	- [ ] Proposals list
		- [ ] Current Budget information
		- [ ] List all proposals [new, paid, completed, failed]
		- [ ] Item: Health, title, author, votes, amount(HLM/USD), payment#
		- [ ] Filter list
	- [ ] Proposal
		- [ ] Details from dash-core
- [ ] **Stage 2** - Participate with generated commands
	- [ ] Vote for proposal
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

# Questions still unanswered

- Offer pre-proposals on-site? Dash has their forum for it.
- Solution for hundreds of proposals? Dash doesn't want to lower their entry fee.
- Markdown vs. WYSIWYG?
- Is providing the email a privacy concern?
- What does "trustless voting" mean?
- Domain name ideas?
- How to have proposal owner accountable after budget allocated?

## TODO

- [x] Ask dashcentral.org if their code is available? [private project]
- [x] Contact the other developer @sabhiram. [no answer]
- [x] Learn Dash command line for budget proposals.
- [x] List out critical and imprtant features
	- [x] DashCentral features
	- [x] Dash community fill-ins (i.e. dashvotetracker.com)
	- [ ] Other coins proposal systems
- [ ] Watch someone from the Dash community actually contribute and vote.
- [x] Find help from community (none so far)
	- [ ] Backend programmer
	- [ ] Frontend programmer
	- [ ] Designer
- [x] What's the MVP?
- [x] Figure out platform
- [ ] Buy domain

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
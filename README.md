# Helium budget proposal

A Budget Proposal system for Helium Payments. Since budget proposals are very connected to Masternodes, it may as well be a Masternode management center.

## Architecture

- Backend (node.js)
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

## Features

- [x] Stage 0 - Figure out theoretical stuff (this README)
- [ ] Stage 1 - GET all info
- [ ] Stage 2 - Participate with generated commands
- [ ] Stage 3 - User based actions
- [ ] Stage 4 - Informational pages
- [ ] Stage 5 - MN Private key based actions

- [ ] MVP
	- [ ] User management
		- [ ] Register, Login, Edit profile
		- [ ] API key gen
		- [ ] Register your masternodes
	- [ ] Proposals list
		- [ ] Budget information
		- [ ] List all proposals [new, paid, completed, failed]
		- [ ] Item: Health, title, author, votes, amount(HLM/USD), comments(unseen), your_vote, payment#
		- [ ] Filter list
	- [ ] Proposal view
		- [ ] Overview
		- [ ] Details from dash-core
		- [ ] Description
		- [ ] Vote
		- [ ] Commenting
		- [ ] Unseen comments are visible
		- [ ] Progress report (have seller accountable)
	- [ ] Submit proposal
		- [ ] Guide
		- [ ] Command generator
		- [ ] Claim your proposal
		- [ ] Add extra info
- [ ] Nice to have
	- [ ] Masternodes
		- [ ] Vote with MN private key (encrypted with pass)
		- [ ] How much a masternode is earning
		- [ ] How much you're earning
		- [ ] Masternodes monitoring
			- [ ] Performance / status
			- [ ] Incidents history
			- [ ] Next payment calculator
		- [ ] Proposal submitting on-site
	- [ ] Info pages
		- [ ] Front page
		- [ ] Getting started with Helium
		- [ ] How to set up a Masternode
		- [ ] Network statistics (incl. MN earnings)
		- [ ] Changelog
	- [ ] Notifications (emails/push/web)
- [ ] Questions
	- Pre-proposals for free?
	- Solution for hundreds of proposals? Dash doesn't want to lower their entry fee.
	- Markdown vs. WYSIWYG editing
	- Email link vs. password (privacy)
	- What does "trustless voting mean?
	- Domain name ideas?

## TODO

- [x] Ask dashcentral.org if their code is available? [private project]
- [x] Contact the other developer @sabhiram. [no answer]
- [x] Learn Dash command line for budget proposals.
- [x] List out critical and imprtant features
	- [x] DashCentral features
	- [x] Dash community fill-ins (i.e. dashvotetracker.com)
	- [ ] Other coins proposal systems
	- [ ] Helium community thoughts (after previous steps done)
- [ ] Watch someone from the Dash community actually contribute and vote.
- [x] Find help from community (none came)
	- [ ] Backend programmer
	- [ ] Frontend programmer
	- [ ] Designer
- [x] What's the MVP?
- [x] Figure out platform
- [ ] Pick hosting provider
- [ ] Domain

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
# Battle.net OAuth2 Token Proxy

A simple Azure function that acts as a proxy for making OAuth2 token requests to Battle.net's API. Might work with other services, but no guarantees.

## Required Settings

* CLIENT_ID
* CLIENT_SECRET
* TOKEN_URL
* REDIRECT
* SCOPE

### Why not use an OAuth2 lib?

Mostly just wanted a very simple proxy for an Electron app to hit against. I could have used a library but that felt like overkill.

### Why node-fetch?

fetch() isn't yet built-in to Node, axios doesn't do well with application/x-www-form-urlencoded data, and I didn't want to write my own promise wrapper to net.request.
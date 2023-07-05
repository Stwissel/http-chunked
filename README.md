# http-chunked

Companion repository to the Blog post [Handle HTTP chunked responses](https://wissel.net/blog/2023/07/handle-http-chunked-responses.html)

## Running

Clone the repo and use the following commands:

```bash
npm install
node server.js
```

The running server will output `Server running on 3000`.

## Usage

open [`http://localhost:3000/`](http://localhost:3000/), fill the number of items to retrieve and click either "`Fetch me`" or "`Chunk me`".

Reload the page to reset.

## Under the hood

The page uses [`localhost/data/someNumber`](http://localhost:3000/data/1000) to retrive data. You could open the page in a browser too.

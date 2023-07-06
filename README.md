# http-chunked

Companion repository to the Blog posts:

- [Handle HTTP chunked responses](https://wissel.net/blog/2023/07/handle-http-chunked-responses.html)
- [Handle HTTP chunked responses, Java edition ](https://wissel.net/blog/2023/07/handle-http-chunked-responses-java.html)

## JavaScript

Uses an express server to generate data. Chunk handling is in `public/index.js`

### Running the server

Clone the repo and use the following commands:

```bash
cd js
npm install
node server.js
```

The running server will output `Server running on 3000`.

### Usage in Browser

open [`http://localhost:3000/`](http://localhost:3000/), fill the number of items to retrieve and click either "`Fetch me`" or "`Chunk me`".

Reload the page to reset.

### Under the hood

The page uses [`localhost/data/someNumber`](http://localhost:3000/data/1000) to retrive data. You could open the page in a browser too.

## Java

It uses the demo server from JS, so follow the steps above to start that

### Building & running the jar

```bash
cd java
mvn clean package
java -jar chunked-http 1000
```

It outputs the values to the console

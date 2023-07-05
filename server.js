'use strict';

const express = require('express');
const app = express();
const uuid = require('uuid');

app.use(express.static('public'));

app.get('/data/:howmany', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write('[\n');
  const howmany = req.params.howmany;
  for (let counter = 0; counter < howmany; counter++) {
    const result = {
      count: counter,
      data: uuid.v4()
    };
    const front = counter == 0 ? '' : ',\n';
    res.write(front + JSON.stringify(result));
  }

  res.end(']');
});

app.listen(3000, () => console.log('Server running on 3000'));

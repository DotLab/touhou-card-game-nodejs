const debug = require('debug')('tcg');
const express = require('express');
const app = require('express')();

const port = 3000;
app.listen(port, () => debug('listening on port %d', port));

app.use(express.static('public'));

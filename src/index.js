const debug = require('debug')('index');
const app = require('express')();

const port = 3000;
app.listen(port, () => debug('listening on port %d', port));

app.get('/', (req, res) => res.send('Hello World!'));

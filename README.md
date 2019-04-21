Touhou Card Game (c) by Kailang Fu

Touhou Card Game is licensed under a
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

You should have received a copy of the license along with this
work. If not, see <http://creativecommons.org/licenses/by-nc-sa/4.0/>.

---

Main Contributors
- Kailang <https://github.com/Kailang>
- Enlne <https://github.com/Enlne>
- Kuobao <https://github.com/Kuobao>
- SirCharlie <https://github.com/SirCharlie>
- Danielczl315 <https://github.com/Danielczl315>
- BingXuhan <https://github.com/BingXuhan>

---

[![Build Status](https://travis-ci.org/DotLab/touhou-card-game-nodejs.svg?branch=master)](https://travis-ci.org/DotLab/touhou-card-game-nodejs)
[![Coverage Status](https://coveralls.io/repos/github/DotLab/touhou-card-game-nodejs/badge.svg?branch=master)](https://coveralls.io/github/DotLab/touhou-card-game-nodejs?branch=master)

Coverage status: <https://coveralls.io/github/DotLab/touhou-card-game-nodejs>

CI status: <https://travis-ci.org/DotLab/touhou-card-game-nodejs>

## Development setup
Install NodeJS 10.x LTS: <https://nodejs.org>

Clone this repository:
```
git clone https://github.com/DotLab/touhou-card-game-nodejs
```

Install back-end dependencies:
```
npm install
```

Install front-end dependencies:
```
cd app && npm install
```

## Production build
Build front end:
```
npm run build-app
```

Run production server on port 3000.
This server also serves front end.
```
npm start
```

## Development commands
### Enable debug log in console
Set environment variable to

### Start web app for development
Start back-end server on port 3000:
```
npm run debug
```

In another console, start CSS compiler:
```
cd app && npm run atomizer
```

In another console again, start front-end server on port 3001.
When asked **"Would you like to run the app on another port instead,"** say yes.
```
cd app && npm start
```

### Run end-to-end tests
Clear database:
```
node ./scripts/clearDatabase.js
```

Run selenium:
```
npm start e2e
```

### Miscellany
Check formats:
```
npm run lint
```

Reformat:
```
npm run lint-fix
```

Run tests:
```
npm run mocha
```

Auto-rerun tests when code changes:
```
npm run debug-be
```

Check formats, run tests and generate coverage report:
```
npm test
```

Serve coverage report on localhost:
```
npm run serve-coverage
```

Generate JSDoc:
```
npm run jsdoc
```

Serve JSDoc on localhost:
```
npm run serve-docs
```

## Git conventions
Start a new branch with name: `<your-github-name-in-lower-case>-<feature-name-in-lower-case>`

*For example, if Kailang wants to add front end HTMLs for login, he needs to start a new branch named `kailang-login-front-end`.*

Submit a Pull Request when you are done.

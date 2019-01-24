Touhou Card Game (c) by Kailang Fu

Touhou Card Game is licensed under a
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

You should have received a copy of the license along with this
work. If not, see <http://creativecommons.org/licenses/by-nc-sa/4.0/>.

---

[![Build Status](https://travis-ci.org/DotLab/touhou-card-game-nodejs.svg?branch=master)](https://travis-ci.org/DotLab/touhou-card-game-nodejs)
[![Coverage Status](https://coveralls.io/repos/github/DotLab/touhou-card-game-nodejs/badge.svg?branch=master)](https://coveralls.io/github/DotLab/touhou-card-game-nodejs?branch=master)

Coverage status: <https://coveralls.io/github/DotLab/touhou-card-game-nodejs>

CI status: <https://travis-ci.org/DotLab/touhou-card-game-nodejs>

## Dev setup
Install NodeJS 10.x LTS: <https://nodejs.org>

Clone this repository:
```
git clone https://github.com/DotLab/touhou-card-game-nodejs
```

Install dependencies:
```
npm install
```

## Dev commands
Start server:
```
npm start
```

Run tests and generate coverage report:
```
npm test
```

Check formats:
```
npm run lint
```

Reformat:
```
npm run lint-fix
```

Generate docs:
```
npm run jsdoc
```

Serve coverage report on localhost:
```
npm run serve-coverage
```

Serve docs on localhost:
```
npm run serve-docs
```

## Dev procedures
Start a new branch with name: `<your-github-name-in-lower-case>-<feature-name-in-lower-case>`

(If Kailang wants to add front end HTMLs for login, he needs to start a new branch named `kailang-login-front-end`)

Submit a Pull Request when you are done.

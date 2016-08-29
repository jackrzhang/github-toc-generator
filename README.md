#node-cli-app-boilerplate
[![dependencies Status](https://david-dm.org/jackrzhang/node-cli-app-boilerplate/status.svg)](https://david-dm.org/jackrzhang/node-cli-app-boilerplate)
[![devDependencies Status](https://david-dm.org/jackrzhang/node-cli-app-boilerplate/dev-status.svg)](https://david-dm.org/jackrzhang/node-cli-app-boilerplate?type=dev)

A simple setup for writing and publishing command-line applications using Node.js.

##Setup
* [Commander]()
* [Chalk]()
* [Babel](https://babeljs.io), with a [babel-cli](https://babeljs.io/docs/usage/cli/) build step
* [ESLint](http://eslint.org/), using [Airbnb's base configuration](https://github.com/airbnb/javascript)

##Usage
###Installation
```sh
git clone https://github.com/jackrzhang/node-cli-app-boilerplate.git
cd node-cli-app-boilerplate
rm -rf .git
git init
npm install
```

###Testing your command-line program
Both `npm link` and `npm install -g` will build and symlink the script to a location on your path.
```sh
npm link
```

###Linting
```sh
npm run lint
```

##License
[MIT](https://github.com/jackrzhang/node-cli-app-boilerplate/blob/master/LICENSE)

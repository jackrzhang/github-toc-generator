# github-toc-generator
[![Build Status](https://travis-ci.org/jackrzhang/github-toc-generator.svg?branch=master)](https://travis-ci.org/jackrzhang/github-toc-generator)
[![npm](https://img.shields.io/npm/v/github-toc-generator.svg)](https://www.npmjs.com/package/github-toc-generator)

A command-line utility for generating Tables of Contents for Github markdown files. All links are Github-compatible anchors.

### Usage
By default, a maximum header depth of 6 and the file `README.md` is utilized.
```
ghtoc [options] <user> <repository> <file>

Options:

  -h, --help            output usage information
  -V, --version         output the version number
  -d, --depth <number>  specifiy the maximum header depth (1 - 6) of the toc
  -o, --open            open the readme in browser
```

### Installation
```sh
$ npm install -g github-toc-generator
```

## Contributing
Issues and pull requests are welcome.
```sh
$ git clone https://github.com/jackrzhang/github-toc-generator
$ cd github-toc-generator
$ npm install -g
```

**Please run linting and tests prior to commits.**
```sh
$ npm run lint
$ npm test
```

## License
[MIT](https://github.com/jackrzhang/github-toc-generator/blob/master/LICENSE)

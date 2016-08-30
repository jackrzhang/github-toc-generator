#!/usr/bin/env node

import program from 'commander';
import pkg from './../package.json';
// import chalk from 'chalk';

program
  .version(pkg.version)
  .usage('[options] <user> <repository>')
  .description('A command-line utility that generates Tables of Contents for Github READMEs.')
  .option('-d, --depth <number>', 'specifiy the maximum header depth (1 - 6) of the TOC')
  .option('-o, --open', 'open the README in browser')
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
} else {
  
}

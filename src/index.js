#!/usr/bin/env node

import program from 'commander';
import request from 'superagent';
import opn from 'opn';
import chalk from 'chalk';

import pkg from './../package.json';

function parseTOC(readMeText, depth) {
  console.log(readMeText);

  process.exit(0);
}

function handleError(err, res) {
  let errorMessage;
  if (res && res.status === 404) {
    errorMessage = '404: README for the specified repository not found.';
  } else if (err) {
    errorMessage = err;
  } else {
    errorMessage = res.text;
  }

  console.error(chalk.red(errorMessage));
  process.exit(1);
}

function generateReadMeTOC(user, repository) {
  request
    .get(`https://raw.githubusercontent.com/${user}/${repository}/master/README.md`)
    .set('Accept', 'text/plain')
    .end((err, res) => {
      if (res && res.ok) {
        if (program.open) {
          opn(`https://github.com/${user}/${repository}/blob/master/README.md`);
          process.exit(0);
        }

        const depth = program.depth ? Number(program.depth) : 6;
        parseTOC(res.text, depth);
      } else {
        handleError(err, res);
      }
    });
}

program
  .version(pkg.version)
  .usage('[options] <user> <repository>')
  .description('A command-line utility that generates Tables of Contents for Github READMEs.')
  .option('-d, --depth <number>', 'specifiy the maximum header depth (1 - 6) of the toc')
  .option('-o, --open', 'open the readme in browser')
  .parse(process.argv);

if (program.args.length !== 2) {
  program.help();
} else {
  const user = program.args[0];
  const repository = program.args[1];

  generateReadMeTOC(user, repository);
}

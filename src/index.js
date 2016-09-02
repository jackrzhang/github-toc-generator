#!/usr/bin/env node

import program from 'commander';
import request from 'superagent';
import opn from 'opn';
import chalk from 'chalk';

import pkg from './../package.json';

function parseHeaders(readMeText, depth) {
  const headers = [];
  const lines = readMeText.split('\n');
  let isCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    // Toggle whether or not text is within a code block
    if (lines[i].includes('```')) isCodeBlock = !isCodeBlock;

    if (!isCodeBlock) {
      // Identify alternate H1 & H2 headers using underline-based styles
      if (i !== lines.length - 1) {
        if (/^=+$/.test(lines[i + 1])) {
          headers.push({ depth: 1, text: lines[i] });
        } else if (/^-+$/.test(lines[i + 1])) {
          headers.push({ depth: 2, text: lines[i] });
        }
      }

      // Identify headers using the '#' character
      if (/^#{1,6}.+$/.test(lines[i])) {
        const headerDepth = lines[i].lastIndexOf('#', 5);
        const headerText = lines[i].substring(headerDepth + 1);

        console.log(headerDepth, headerText);
      }
    }
  }

  return headers;
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
        const headers = parseHeaders(res.text, depth);

        process.exit(0);
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

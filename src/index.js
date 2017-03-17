#!/usr/bin/env node

import program from 'commander';
import request from 'superagent';
import opn from 'opn';
import chalk from 'chalk';

import pkg from './../package.json';

export function parseHeaders(readMeText) {
  const headers = [];
  const lines = readMeText.split('\n');
  let isCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    // Extract contents of markdown links
    if (/\[([^\]]+)\][^)]+\)/g.test(lines[i])) {
      lines[i] = lines[i].replace(/\[([^\]]+)\][^)]+\)/g, '$1');
    }

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
        const headerDepth = lines[i].lastIndexOf('#', 5) + 1;
        const headerText = lines[i].substring(headerDepth);

        headers.push({ depth: headerDepth, text: headerText });
      }
    }
  }

  return headers;
}

export function processHeaders(headers, depth) {
  const processedHeaders = [];
  const usedAnchors = {};

  /*
    Algorithm for creating anchors:
    1. Strip whitespace from both ends
    2. Lowercase
    3. Remove any character that is not a letter, number, space, or hyphen
    4. Change any space to a hyphen
    5. If anchor is not unique within the document, concat '-1', '-2', etc.
  */
  const createAnchor = (text) => {
    let anchor = text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s/g, '-');

    if (usedAnchors[anchor]) {
      usedAnchors[anchor]++;
      anchor = `${anchor}-${usedAnchors[anchor]}`;
    } else {
      usedAnchors[anchor] = 1;
    }

    return anchor;
  };

  for (let i = 0; i < headers.length; i++) {
    if (headers[i].depth <= depth) {
      processedHeaders.push({
        depth: headers[i].depth,
        text: headers[i].text.trim(),
        anchor: createAnchor(headers[i].text)
      });
    }
  }

  return processedHeaders;
}

export function createTOC(headers) {
  let TOC = '';

  for (let i = 0; i < headers.length; i++) {
    TOC = TOC.concat(
      `${' '.repeat((headers[i].depth * 2) - 1)}* [${headers[i].text}](#${headers[i].anchor})\n`
    );
  }

  return TOC;
}

function handleError(err, res) {
  let errorMessage;
  if (res && res.status === 404) {
    errorMessage = '404: File for the specified repository not found.';
  } else if (err) {
    errorMessage = err;
  } else {
    errorMessage = res.text;
  }

  console.error(chalk.red(errorMessage));
  process.exit(1);
}

function generateReadMeTOC(user, repository, file) {
  request
    .get(`https://raw.githubusercontent.com/${user}/${repository}/master/${file}`)
    .set('Accept', 'text/plain')
    .end((err, res) => {
      if (res && res.ok) {
        if (program.open) {
          opn(`https://github.com/${user}/${repository}/blob/master/${file}`);
          process.exit(0);
        }

        let headers = parseHeaders(res.text);

        const depth = program.depth ? Number(program.depth) : 6;
        headers = processHeaders(headers, depth);

        const TOC = createTOC(headers);
        console.log(chalk.blue(TOC));

        process.exit(0);
      } else {
        handleError(err, res);
      }
    });
}

program
  .version(pkg.version)
  .usage('[options] <user> <repository> <Markdown File>')
  .description('A command-line utility that generates Tables of Contents for Github Markdown files. Default file is "README.md"')
  .option('-d, --depth <number>', 'specifiy the maximum header depth (1 - 6) of the toc')
  .option('-o, --open', 'open the readme in browser')
  .parse(process.argv);

program.on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ ghtoc Alice BobPics README.md #generates a ToC for the README.md');
  console.log('    $ ghtoc Alice BobPics INSTALL.md #generates a ToC for the specified markdown file');
});
if (program.args.length !== 3) {
  program.help();
} else {
  const user = program.args[0];
  const repository = program.args[1];
  let file = program.args[2]
  if(!file)
  {
    file="README.md"
  }
  generateReadMeTOC(user, repository, file);
}

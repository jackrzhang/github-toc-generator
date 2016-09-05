import { expect } from 'chai';
import { parseHeaders } from './../src';

describe('parseHeaders', () => {
  const basicInput =
  '# poke\n' +
  'A game for cats (and incredibly bored humans alike). Poke the ball 50 times to win.\n' +
  '\n' +
  'Click [here](http://poke.jackrzhang.com) to play.\n' +
  '\n' +
  '#### tools:\n' +
  '1. Physics and animation handled through [Popmotion](https://github.com/Popmotion/popmotion).\n' +
  '2. Ball styling handled through the CSS [radial-gradient function](https://developer.mozilla.org/en-US/docs/Web/CSS/radial-gradient).\n' +
  '3. Get your confetti [here](http://jsfiddle.net/vxP5q/61/?utm_source=website&utm_medium=embed&utm_campaign=vxP5q) :D\n';

  it('should return an array of objects representing parsed headers', () => {
    expect(parseHeaders(basicInput)).to.be.an('array');
    expect(parseHeaders(basicInput)[0]).to.be.an('object');
  });

  it('should return an array of objects that have properties `depth` and `text`', () => {
    expect(parseHeaders(basicInput)[0]).to.have.property('depth');
    expect(parseHeaders(basicInput)[0].depth).to.be.a('number');

    expect(parseHeaders(basicInput)[0]).to.have.property('text');
    expect(parseHeaders(basicInput)[0].text).to.be.a('string');
  });

  it('should identify headers notated using the `#` character', () => {
    const headersUsingPound =
    '## header\n' +
    'not a header\n' +
    '   ## should not be a header\n' +
    'should not be ###a header\n' +
    '### a second header';

    expect(parseHeaders(headersUsingPound)).to.deep.equal([
      { depth: 2, text: ' header' },
      { depth: 3, text: ' a second header' }
    ]);
  });

  it('should identify alternate h1 & h2 headers using underline-based styles', () => {
    const headersUsingUnderlines =
    'This is not a header\n' +
    'This is a header\n' +
    '----------------\n' +
    'This is another header\n' +
    '======================\n' +
    'This is not a header';

    expect(parseHeaders(headersUsingUnderlines)).to.deep.equal([
      { depth: 2, text: 'This is a header' },
      { depth: 1, text: 'This is another header' }
    ]);
  });

  it('should not identify any headers within code blocks', () => {
    const markdownWithCodeBlocks =
    '#A Header\n' +
    '```\n' +
    '## headers in here should not be identified\n' +
    'foo() bar \n' +
    '=========\n' +
    '```\n' +
    '#### Another Header\n';

    expect(parseHeaders(markdownWithCodeBlocks)).to.deep.equal([
      { depth: 1, text: 'A Header' },
      { depth: 4, text: ' Another Header' }
    ]);
  });

  it('should extract contents of headers that are also markdown links', () => {
    const markdownLinks =
    '### Header\n' +
    '[Link](https://www.google.com)\n' +
    '## [Header](https://www.google.com)\n' +
    '###### [Link](https://www.google.com)';

    expect(parseHeaders(markdownLinks)).to.deep.equal([
      { depth: 3, text: ' Header' },
      { depth: 2, text: ' Header' },
      { depth: 6, text: ' Link' }
    ]);
  });
});

import { expect } from 'chai';
import { processHeaders } from './../src';

describe('processHeaders', () => {
  const basicInput = [
    { depth: 1, text: 'Main title' },
    { depth: 3, text: ' a second header' }
  ];

  it('should should return an array of objects representing processed headers', () => {
    expect(processHeaders(basicInput, 6)).to.be.an('array');
    expect(processHeaders(basicInput, 6)[0]).to.be.an('object');
  });

  it('should return an array of objects that have properties `depth`, `text`, and `anchor`', () => {
    expect(processHeaders(basicInput, 6)[0]).to.have.property('depth');
    expect(processHeaders(basicInput, 6)[0].depth).to.be.a('number');

    expect(processHeaders(basicInput, 6)[0]).to.have.property('text');
    expect(processHeaders(basicInput, 6)[0].text).to.be.a('string');

    expect(processHeaders(basicInput, 6)[0]).to.have.property('anchor');
    expect(processHeaders(basicInput, 6)[0].text).to.be.a('string');
  });

  it('should trim whitespace from the edges of processed header text', () => {
    const headersWithWhitespace = [
      { depth: 1, text: '    main title   ' },
      { depth: 4, text: 'header here  ' },
      { depth: 4, text: '  another header' }
    ];

    expect(processHeaders(headersWithWhitespace, 6)).to.deep.equal([
      {
        depth: 1,
        text: 'main title',
        anchor: 'main-title'
      }, {
        depth: 4,
        text: 'header here',
        anchor: 'header-here'
      }, {
        depth: 4,
        text: 'another header',
        anchor: 'another-header'
      }
    ]);
  });

  it(`should strip whitespace from both ends, lowercase, remove any character that is not a letter,
    number, space, or hyphen, and replaces spaces with hyphens when generating anchor text`, () => {
    const headersWithNonAnchorCharacters = [
      { depth: 1, text: '  #  ^%^7234main title   ' },
      { depth: 4, text: 'header here ++ - ' },
      { depth: 4, text: ' test : another header' }
    ];

    expect(processHeaders(headersWithNonAnchorCharacters, 6)).to.deep.equal([
      {
        depth: 1,
        text: '#  ^%^7234main title',
        anchor: '--7234main-title'
      }, {
        depth: 4,
        text: 'header here ++ -',
        anchor: 'header-here---'
      }, {
        depth: 4,
        text: 'test : another header',
        anchor: 'test--another-header'
      }
    ]);
  });

  it('should concat number labels to the end of repeated, non-unique anchor text', () => {
    const headersWithNonUniqueAnchors = [
      { depth: 1, text: 'header text' },
      { depth: 5, text: 'more header text' },
      { depth: 4, text: 'header text' },
      { depth: 3, text: 'header text' },
      { depth: 1, text: 'more header text' }
    ];

    expect(processHeaders(headersWithNonUniqueAnchors, 6)).to.deep.equal([
      {
        depth: 1,
        text: 'header text',
        anchor: 'header-text'
      }, {
        depth: 5,
        text: 'more header text',
        anchor: 'more-header-text'
      }, {
        depth: 4,
        text: 'header text',
        anchor: 'header-text-2'
      }, {
        depth: 3,
        text: 'header text',
        anchor: 'header-text-3'
      }, {
        depth: 1,
        text: 'more header text',
        anchor: 'more-header-text-2'
      }
    ]);
  });

  it('should filter out headers based on a specified maximum depth', () => {
    const headersWithDepth = [
      { depth: 4, text: 'header text' },
      { depth: 5, text: 'more header text' },
      { depth: 2, text: 'another header' },
      { depth: 6, text: 'text' },
      { depth: 1, text: 'title' },
      { depth: 3, text: 'subtitle' },
    ];

    expect(processHeaders(headersWithDepth, 5)).to.deep.equal([
      {
        depth: 4,
        text: 'header text',
        anchor: 'header-text'
      }, {
        depth: 5,
        text: 'more header text',
        anchor: 'more-header-text'
      }, {
        depth: 2,
        text: 'another header',
        anchor: 'another-header'
      }, {
        depth: 1,
        text: 'title',
        anchor: 'title'
      }, {
        depth: 3,
        text: 'subtitle',
        anchor: 'subtitle'
      }
    ]);

    expect(processHeaders(headersWithDepth, 2)).to.deep.equal([
      {
        depth: 2,
        text: 'another header',
        anchor: 'another-header'
      }, {
        depth: 1,
        text: 'title',
        anchor: 'title'
      }
    ]);
  });
});

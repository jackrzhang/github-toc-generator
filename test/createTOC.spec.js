import { expect } from 'chai';
import { createTOC } from './../src';

describe('createTOC', () => {
  it('should return a string representing a markdown TOC', () => {
    const emptyHeaders = [];
    expect(createTOC(emptyHeaders)).to.be.a('string');
  });

  it('should generate markdown links in list format', () => {
    const headersInput = [
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
    ];

    expect(createTOC(headersInput)).to.equal(
      ' * [main title](#main-title)\n' +
      '       * [header here](#header-here)\n' +
      '       * [another header](#another-header)\n');
  });
});

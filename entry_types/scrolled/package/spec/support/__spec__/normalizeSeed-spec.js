import {normalizeSeed} from '../normalizeSeed';

describe('normalizeSeed', () => {
  it('ensures minimal config is present', () => {
    const result = normalizeSeed({});

    expect(result).toMatchObject({
      config: {
        fileUrlTemplates: {}
      }
    });
  });

  it('supports imageFileUrlTemplates property', () => {
    const result = normalizeSeed({
      imageFileUrlTemplates: {large: '/some/url'}
    });

    expect(result).toMatchObject({
      config: {
        fileUrlTemplates: {
          imageFiles: {large: '/some/url'}
        }
      }
    });
  });

  it('supports fileUrlTemplates property', () => {
    const result = normalizeSeed({
      fileUrlTemplates: {
        videoFiles: {
          high: '/some/url'
        }
      }
    });

    expect(result).toMatchObject({
      config: {
        fileUrlTemplates: {
          videoFiles: {high: '/some/url'}
        }
      }
    });
  });

  it('ensures empty collections are present', () => {
    const result = normalizeSeed({});

    expect(result).toMatchObject({
      collections: {
        imageFiles: [],
        chapters: [],
        sections: [],
        contentElements: [],
      }
    });
  });

  it('ensures required image file properties are present', () => {
    const result = normalizeSeed({
      imageFiles: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        imageFiles: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            width: expect.any(Number),
            height: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures required chapter properties are present', () => {
    const result = normalizeSeed({
      chapters: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        chapters: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures a chapter is present if sections are present', () => {
    const result = normalizeSeed({
      sections: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        chapters: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
    expect(result.collections.sections[0].chapterId).toBe(result.collections.chapters[0].id);
  });

  it('ensures required section properties are present', () => {
    const result = normalizeSeed({
      sections: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        sections: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures required content element properties are present', () => {
    const result = normalizeSeed({
      contentElements: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        contentElements: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });
});

import {pageType} from 'frontend';

describe('pageType', () => {
  describe('invokeInitializers', () => {
    it('calls registered page type initializers', () => {
      const initializer = jest.fn();
      pageType.registerInitializer('video', initializer);

      pageType.invokeInitializers([
        {template: 'video', configuration: {video: 10}}
      ]);

      expect(initializer).toHaveBeenCalledWith({video: 10});
    });

    it('ignores pages without initializer', () => {
      expect(() => {
        pageType.invokeInitializers([
          {template: 'image', configuration: {image: 10}}
        ]);
      }).not.toThrowError();
    });
  });
});

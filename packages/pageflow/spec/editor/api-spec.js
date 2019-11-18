import {EditorApi} from '$pageflow/editor';

import sinon from 'sinon';

describe('pageflow.EditorApi', () => {
  describe('#selectFile', () => {
    test('navigates to files route for file type given as string', () => {
      var router = fakeRouter();
      var api = new EditorApi({router: router});

      api.selectFile('image_files', 'some_handler');

      expect(router.navigate).toHaveBeenCalledWith(
        sinon.match('/files/image_files').and(sinon.match('handler=some_handler'))
      );
    });

    test('navigates to files route for file type given as object', () => {
      var router = fakeRouter();
      var api = new EditorApi({router: router});

      api.selectFile({name: 'image_files', filter: 'large'}, 'some_handler');

      expect(router.navigate).toHaveBeenCalledWith(
        sinon.match('/files/image_files')
          .and(sinon.match('handler=some_handler'))
          .and(sinon.match('filter=large'))
      );
    });

    test('passes payload as serialized string', () => {
      var router = fakeRouter();
      var api = new EditorApi({router: router});

      api.selectFile('image_files', 'some_handler', {some: 'payload'});

      expect(router.navigate).toHaveBeenCalledWith(
        sinon.match('payload=%7B%22some%22%3A%22payload%22%7D')
      );
    });

    function fakeRouter() {
      return {navigate: sinon.spy()};
    }
  });
});

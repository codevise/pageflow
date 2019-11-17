describe('pageflow.EditorApi', function() {
  describe('#selectFile', function() {
    it('navigates to files route for file type given as string', function() {
      var router = fakeRouter();
      var api = new pageflow.EditorApi({router: router});

      api.selectFile('image_files', 'some_handler');

      expect(router.navigate).to.have.been.calledWith(
        sinon.match('/files/image_files').and(sinon.match('handler=some_handler'))
      );
    });

    it('navigates to files route for file type given as object', function() {
      var router = fakeRouter();
      var api = new pageflow.EditorApi({router: router});

      api.selectFile({name: 'image_files', filter: 'large'}, 'some_handler');

      expect(router.navigate).to.have.been.calledWith(
        sinon.match('/files/image_files')
          .and(sinon.match('handler=some_handler'))
          .and(sinon.match('filter=large'))
      );
    });

    it('passes payload as serialized string', function() {
      var router = fakeRouter();
      var api = new pageflow.EditorApi({router: router});

      api.selectFile('image_files', 'some_handler', {some: 'payload'});

      expect(router.navigate).to.have.been.calledWith(
        sinon.match('payload=%7B%22some%22%3A%22payload%22%7D')
      );
    });

    function fakeRouter() {
      return {navigate: sinon.spy()};
    }
  });
});

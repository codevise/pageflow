describe('HostedFile', function() {
  describe('#processingStages', function() {
    it('is appended to stages', function() {
      var File = pageflow.HostedFile.extend({
        processingStages: [
          {
            name: 'unpacking',
            activeStates: ['unpacking'],
            failedStates: ['unpacking_failed']
          }
        ]
      });
      var hostedFile = new File();

      expect(hostedFile.stages.pluck('name')).to.deep.eq(['uploading', 'unpacking']);
    });

    it('can be a function', function() {
      var File = pageflow.HostedFile.extend({
        processingStages: function() {
          return [
            {
              name: 'unpacking',
              activeStates: ['unpacking'],
              failedStates: ['unpacking_failed']
            }
          ];
        }
      });
      var hostedFile = new File();

      expect(hostedFile.stages.pluck('name')).to.deep.eq(['uploading', 'unpacking']);
    });
  });
});
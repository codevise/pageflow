describe('pageflow.NestedFilesCollection', function() {
  it('supports custom order defined by nested file type', function() {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      textTrackFileTypeOptions: {
        nestedFilesOrder: {
          comparator: function(textTrackFile) {
            return textTrackFile.configuration.get('label');
          }
        }
      },

      textTrackFilesAttributes: [
        {configuration: {label: 'B'}},
        {configuration: {label: 'Z'}},
        {configuration: {label: 'A'}}
      ]
    });

    var nestedFiles = new pageflow.NestedFilesCollection({
      parent: fixture.textTrackFiles,
      parentFile: fixture.videoFile
    });

    var labels = nestedFiles.map(function(textTrackFile) {
      return textTrackFile.configuration.get('label');
    });
    expect(labels).to.eql(['A', 'B', 'Z']);
  });

  it('sort when nested files order binding changes', function() {
    var fixture = support.factories.videoFileWithTextTrackFiles({
      textTrackFileTypeOptions: {
        nestedFilesOrder: {
          comparator: function(textTrackFile) {
            return textTrackFile.configuration.get('label');
          },
          binding: 'label'
        }
      },

      textTrackFilesAttributes: [
        {configuration: {label: 'B'}},
        {configuration: {label: 'Z'}},
        {configuration: {label: 'A'}}
      ]
    });

    var nestedFiles = new pageflow.NestedFilesCollection({
      parent: fixture.textTrackFiles,
      parentFile: fixture.videoFile
    });
    fixture.textTrackFiles.last().configuration.set('label', 'D');

    var labels = nestedFiles.map(function(textTrackFile) {
      return textTrackFile.configuration.get('label');
    });
    expect(labels).to.eql(['B', 'D', 'Z']);
  });
});

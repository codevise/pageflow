import {ExplorerFolderItemView, FileFolder} from 'pageflow/editor';
import userEvent from '@testing-library/user-event';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('ExplorerFolderItemView', () => {
  it('displays folder name', () => {
    const view = new ExplorerFolderItemView({
      model: new FileFolder({name: 'Photos'}),
      onSelectFolder: jest.fn()
    });

    const {getByText} = render(view);

    expect(getByText('Photos')).not.toBeNull();
  });

  it('enters folder on click', async () => {
    const folder = new FileFolder({name: 'Photos'});
    const onSelectFolder = jest.fn();
    const view = new ExplorerFolderItemView({model: folder, onSelectFolder});
    const user = userEvent.setup();

    const {getByText} = render(view);
    await user.click(getByText('Photos'));

    expect(onSelectFolder).toHaveBeenCalledWith(folder);
  });
});

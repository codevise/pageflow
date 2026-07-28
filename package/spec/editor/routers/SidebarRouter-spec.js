import Backbone from 'backbone';

import {SidebarRouter} from 'pageflow/editor';

describe('SidebarRouter', () => {
  function routeFragment(fragment) {
    const controller = {};

    Object.values(SidebarRouter.prototype.appRoutes).forEach(methodName => {
      controller[methodName] = jest.fn();
    });

    new SidebarRouter({controller});

    const handler = Backbone.history.handlers.find(({route}) => route.test(fragment));
    handler.callback(fragment);

    return controller;
  }

  it('routes files list', () => {
    const controller = routeFragment('files');

    expect(controller.files).toHaveBeenCalledWith(null, null);
  });

  it('routes files list with collection name', () => {
    const controller = routeFragment('files/image_files');

    expect(controller.files).toHaveBeenCalledWith('image_files', null);
  });

  it('routes files list of folder', () => {
    const controller = routeFragment('files/folders/5');

    expect(controller.files).toHaveBeenCalledWith(null, '5');
  });

  it('routes files list of folder with collection name', () => {
    const controller = routeFragment('files/image_files/folders/5');

    expect(controller.files).toHaveBeenCalledWith('image_files', '5');
  });

  it('routes file selection request with collection name', () => {
    const controller = routeFragment('files/image_files?handler=some_handler&payload=%7B%7D');

    expect(controller.files).toHaveBeenCalledWith('image_files', null, 'some_handler', '{}');
  });

  it('routes file selection request without collection name', () => {
    const controller = routeFragment('files?handler=some_handler&payload=%7B%7D');

    expect(controller.files).toHaveBeenCalledWith(null, null, 'some_handler', '{}');
  });

  it('routes file selection request inside folder', () => {
    const controller = routeFragment(
      'files/image_files/folders/5?handler=some_handler&payload=%7B%7D'
    );

    expect(controller.files).toHaveBeenCalledWith('image_files', '5', 'some_handler', '{}');
  });

  it('routes file selection request inside folder without collection name', () => {
    const controller = routeFragment('files/folders/5?handler=some_handler&payload=%7B%7D');

    expect(controller.files).toHaveBeenCalledWith(null, '5', 'some_handler', '{}');
  });

  it('routes file selection request with filter', () => {
    const controller = routeFragment(
      'files/image_files?handler=some_handler&payload=%7B%7D&filter=large'
    );

    expect(controller.files).toHaveBeenCalledWith(
      'image_files', null, 'some_handler', '{}', 'large'
    );
  });

  it('routes file selection request with filter inside folder', () => {
    const controller = routeFragment(
      'files/image_files/folders/5?handler=some_handler&payload=%7B%7D&filter=large'
    );

    expect(controller.files).toHaveBeenCalledWith(
      'image_files', '5', 'some_handler', '{}', 'large'
    );
  });
});

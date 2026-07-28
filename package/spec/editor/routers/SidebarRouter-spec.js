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

  it('routes file selection request with collection name', () => {
    const controller = routeFragment('files/image_files?handler=some_handler&payload=%7B%7D');

    expect(controller.files).toHaveBeenCalledWith('image_files', 'some_handler', '{}');
  });

  it('routes file selection request without collection name', () => {
    const controller = routeFragment('files?handler=some_handler&payload=%7B%7D');

    expect(controller.files).toHaveBeenCalledWith(null, 'some_handler', '{}');
  });

  it('routes file selection request with filter', () => {
    const controller = routeFragment(
      'files/image_files?handler=some_handler&payload=%7B%7D&filter=large'
    );

    expect(controller.files).toHaveBeenCalledWith(
      'image_files', 'some_handler', '{}', 'large'
    );
  });
});

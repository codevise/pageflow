import Backbone from 'backbone';
import {serverSideValidation} from 'pageflow/ui';

import * as support from '$support';

describe('serverSideValidation', () => {
  let testContext;

  beforeEach(() => testContext = {});

  support.useFakeXhr(() => testContext);

  it('parses errors from request that fails with 422', () => {
    const Model = Backbone.Model.extend({
      url: '/models',

      mixins: [serverSideValidation],
    });
    const model = new Model({name: ''})

    model.save();
    testContext.requests[0].respond(
      422,
      {'Content-Type': 'application/json' },
      JSON.stringify({
        errors: {
          name: ['cannot be blank']
        }
      })
    );

    expect(model.validationErrors).toEqual({
      name: ['cannot be blank']
    });
  });

  it('triggers invalid event', () => {
    const Model = Backbone.Model.extend({
      url: '/models',

      mixins: [serverSideValidation],
    });
    const model = new Model({name: ''})
    const listener = jest.fn();

    model.on('invalid', listener);
    model.save();
    testContext.requests[0].respond(
      422,
      {'Content-Type': 'application/json' },
      JSON.stringify({
        errors: {
          name: ['cannot be blank']
        }
      })
    );

    expect(listener).toHaveBeenCalled();
  });

  it('resets validation errors when saved successfully', () => {
    const Model = Backbone.Model.extend({
      url: '/models',

      mixins: [serverSideValidation],
    });
    const model = new Model({name: ''})

    model.save();
    testContext.requests[0].respond(
      422,
      {'Content-Type': 'application/json' },
      JSON.stringify({
        errors: {
          name: ['cannot be blank']
        }
      })
    );
    model.save();
    testContext.requests[1].respond(
      200,
      {'Content-Type': 'application/json' },
      JSON.stringify({})
    );

    expect(model.validationErrors).toEqual({});
  });
});

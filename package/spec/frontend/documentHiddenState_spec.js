
import {documentHiddenState} from 'pageflow/frontend';

describe('#documentHiddenState', function(){
  
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('registers a callback to be invoked on document visibility change', function(){
    let callback = jest.fn();
    documentHiddenState(callback);
    document.dispatchEvent(new Event('visibilitychange'));
    
    expect(callback).toHaveBeenCalled();
  });

  it('returns an object with visibility state and function to remove callback', function () {
    let callback = jest.fn();
    let state = documentHiddenState(callback);
    state.removeCallback();

    document.dispatchEvent(new Event('visibilitychange'));

    expect(callback).not.toHaveBeenCalled();
  });

});

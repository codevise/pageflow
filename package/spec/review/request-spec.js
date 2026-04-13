import {request} from 'review/request';

describe('request', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('performs request and returns parsed JSON', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({some: 'data'})
    });

    const result = await request({url: '/some/path', method: 'GET'});

    expect(window.fetch).toHaveBeenCalledWith('/some/path', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    });
    expect(result).toEqual({some: 'data'});
  });

  it('sends JSON body with CSRF token for POST requests', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({id: 1})
    });

    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = 'test-token';
    document.head.appendChild(meta);

    await request({url: '/some/path', method: 'POST', payload: {body: 'Hello'}});

    expect(window.fetch).toHaveBeenCalledWith('/some/path', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'test-token'
      },
      body: '{"body":"Hello"}'
    });

    document.head.removeChild(meta);
  });

  it('throws on non-ok response', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity'
    });

    await expect(
      request({url: '/some/path', method: 'GET'})
    ).rejects.toThrow('422');
  });
});

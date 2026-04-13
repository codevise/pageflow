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

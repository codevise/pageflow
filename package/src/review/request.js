export async function request({url, method, payload}) {
  const headers = {
    'Accept': 'application/json'
  };

  const options = {
    method,
    credentials: 'same-origin',
    headers
  };

  if (payload) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

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
    headers['X-CSRF-Token'] = getCSRFToken();
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

function getCSRFToken() {
  const meta = typeof document !== 'undefined' &&
               document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.content : '';
}

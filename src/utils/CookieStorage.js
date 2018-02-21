const TYPES = new Map();
TYPES.set('boolean', (v) => v !== 'false');
TYPES.set('number', (v) => parseFloat(v));

function getValue (value) {
  const parts = value.split(':');
  if (TYPES.has(parts[0])) {
    return TYPES.get(parts[0])(parts[1]);
  }
  return parts[1];
}

function getCookie (name) {
  var matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? getValue(decodeURIComponent(matches[1])) : undefined;
}

function setCookie (name, value) {
  value = encodeURIComponent((typeof value) + ':' + value);
  document.cookie = name + '=' + value;
}

export default {
  get: getCookie,
  put: setCookie
};

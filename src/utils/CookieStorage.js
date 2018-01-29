function getCookie (name) {
  var matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie (name, value) {
  value = encodeURIComponent(value);
  document.cookie = name + '=' + value;
}

export default {
  get: getCookie,
  put: setCookie
};

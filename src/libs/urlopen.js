import url from 'url'
import querystring from 'querystring'
import style from './style.js'

export function initialStyle() {
  const initialUrl = url.parse(window.location.href, true)
  return (initialUrl.query || {}).style
}

export function loadStyleUrl(styleUrl, cb) {
  console.log('Loading style', styleUrl)
  fetch(styleUrl, {
    mode: 'cors',
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + localStorage.getItem('openid_token')
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(body) {
    cb(style.ensureStyleValidity(body))
  })
  .catch(function(err) {
    console.error(err);
    console.warn('Could not fetch default style', styleUrl)
    cb(style.emptyStyle)
  })
}

export function saveStyle(styleId, body, cb) {
  fetch('/api/infra/vector-tile/styles/' + styleId, {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'cors',
    body: body,
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('openid_token')}
  }).then(function (response) {
    return response.json();
  })
    .then(function (body) {
      cb(body)
    })
    .catch(function (err) {
      console.error(err);
      console.warn('Could not save style', styleId, body)
      cb(style.emptyStyle)
    })
}

export function removeStyleQuerystring() {
  const initialUrl = url.parse(window.location.href, true)
  let qs = querystring.parse(window.location.search.slice(1))
  delete qs["style"]
  if(Object.getOwnPropertyNames(qs).length === 0) {
    qs = ""
  } else {
    qs = "?" + querystring.stringify(qs)
  }
  let newUrlHash = initialUrl.hash
  if(newUrlHash === null) {
    newUrlHash = ""
  }
  const newUrl = initialUrl.protocol + "//" + initialUrl.host + initialUrl.pathname + qs + newUrlHash
  window.history.replaceState({}, document.title, newUrl)
}

export function loadJSON(url, defaultValue, cb) {
  fetch(url, {
    mode: 'cors',
    credentials: "same-origin"
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(body) {
    try {
      cb(body)
    } catch(err) {
      console.error(err)
      cb(defaultValue)
    }
  })
  .catch(function() {
    console.error('Can not load JSON from ' + url)
    cb(defaultValue)
  })
}

document.addEventListener('DOMContentLoaded', function () {

  function hasQueryString (url) {
    // regex pattern for detecting querystring
    var pattern = new RegExp(/\?.+=.*/g)
    return pattern.test(url)
  }

  /*
   * Thanks to https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
  */
  function getParams (url) {
    if (!url) url = window.location.href
    var params = {}
    var parser = document.createElement('a')
    parser.href = url
    var query = parser.search.substring(1)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      params[pair[0]] = decodeURIComponent(pair[1])
    }
    return params
  }

  function replaceParamsInNodes (node, key, value) {
    if (node.parentElement) {
      //console.log('Parent element %s', node.parentElement.nodeName)
      if (node.parentElement.nodeName === 'code' ||
        node.parentElement.nodeName === 'CODE') {
        return
      }
    }
    if (node.nodeType === 3) {
      var text = node.data
      node.data = applyPattern(text, key, value)
    }
    if (node.nodeType === 1 && node.nodeName !== 'SCRIPT') {
      for (var i = 0; i < node.childNodes.length; i++) {
        replaceParamsInNodes(node.childNodes[i], key, value)
      }
    }
  }

  var allParams = getParams()
  var keys = Object.keys(allParams)
  for (var i = 0; i < keys.length; i++) {
    replaceParamsInNodes(document.body, keys[i], allParams[keys[i]])
  }

  //Handle links
  var allQueryPramLinks = document.querySelectorAll('.query-params-link')
  if (allQueryPramLinks) {
    allQueryPramLinks.forEach(appendQueryStringToHref)
  }

  var pramLinks = document.querySelectorAll('.params-link')
  if (pramLinks) {
    pramLinks.forEach(appendQueryStringToHref)
  }

  var allNavLinks = document.querySelectorAll('.nav-link')
  if (allNavLinks) {
    allNavLinks.forEach(appendQueryStringToHref)
  }

  function appendQueryStringToHref (el) {
    var queryString = window.location.search
    var appendQueryString = el.classList.contains('query-params-link') ||
      el.classList.contains('nav-link')
    if (!hasQueryString(el.href) && queryString) {
      var href = el.href
      for (var i = 0; i < keys.length; i++) {
        href = applyPattern(href, keys[i], allParams[keys[i]])
      }
      if (appendQueryString) {
        el.href = href + queryString
      } else {
        el.href = href
      }

    }
  }

  function applyPattern (str, key, value) {
    //(%25key%25|%key%) %25 is urlencode value of %
    var pattern = '(' + '%25' + key + '%25' +
      '|(?<!-)' + '%' + key + '%' + '(?!-))'
    var re = new RegExp(pattern, 'gi')
    return str.replace(re, value)
  }
})

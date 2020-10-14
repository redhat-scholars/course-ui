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

  function replaceParamsInNodes (node, pattern, value) {
    var re = new RegExp(pattern, 'gi')
    if (node.nodeType === 3) {
      var text = node.data
      if (text.match(re)) {
        if (value) {
          node.data = text.replace(re, value)
        }
      }
    }
    if (node.nodeType === 1 && node.nodeName !== 'SCRIPT') {
      for (var i = 0; i < node.childNodes.length; i++) {
        replaceParamsInNodes(node.childNodes[i], pattern, value)
      }
    }
  }

  var allParams = getParams()
  var keys = Object.keys(allParams)
  for (var i = 0; i < keys.length; i++) {
    replaceParamsInNodes(document.body, '(%' + keys[i].toUpperCase() + '%)', allParams[keys[i]])
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
      //console.log('Orginal href %s', href)
      for (var i = 0; i < keys.length; i++) {
        //console.log('href %s', href)
        //(%25key%25|%key%) %25 is urlencode value of %
        var paramKeyPattern = '(' + '%25' + keys[i] + '%25' +
          '|' + '%' + keys[i] + '%' + ')'
        //console.log('Replacing %s', paramKeyPattern)
        var re = new RegExp(paramKeyPattern, 'gi')
        href = href.replace(re, allParams[keys[i]])
        //console.log('after replace href %s', href)
      }
      if (appendQueryString) {
        el.href = href + queryString
      } else {
        el.href = href
      }

    }
  }
})

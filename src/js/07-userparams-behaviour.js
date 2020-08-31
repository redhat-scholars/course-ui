document.addEventListener('DOMContentLoaded', function () {
  var queryString = window.location.search

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
    if (node.nodeType === 3) {
      var re = new RegExp(pattern, 'g')
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

  document.querySelectorAll('.userfied-link').forEach(function (el) {
    el.href += queryString
  })

  document.querySelectorAll('.nav-link').forEach(function (el) {
    el.href += queryString
  })
})

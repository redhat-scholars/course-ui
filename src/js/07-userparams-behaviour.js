document.addEventListener('DOMContentLoaded', function () {
  var queryString = window.location.href

  function getParameterByName (name, url) {
    if (!url) url = queryString
    name = name.replace(/[[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    var val = decodeURIComponent(results[2].replace(/\+/g, ' '))
    console.log(name + '=' + val)
    return val
  }

  function walkText (node, pattern, value) {
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
        walkText(node.childNodes[i], pattern, value)
      }
    }
  }

  walkText(document.body, '(%USER%|\\$USERNAME)', getParameterByName('USER'))
  walkText(document.body, '(%PASSWORD%|\\$PASSWORD)', getParameterByName('PASSWORD'))

  document.querySelectorAll('.userfied-link').forEach(function (el) {
    el.href += queryString
  })

  document.querySelectorAll('.nav-link').forEach(function (el) {
    el.href += queryString
  })
})

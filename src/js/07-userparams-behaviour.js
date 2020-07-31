document.addEventListener('DOMContentLoaded', function () {
  var queryString = window.location.search
  var urlParams = new URLSearchParams(queryString)
  var username = urlParams.get('USER')
  var password = urlParams.get('PASSWORD')

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

  walkText(document.body, '(%USER%|\\$USERNAME)', username)
  walkText(document.body, '(%PASSWORD%|\\$PASSWORD)', password)

  document.querySelectorAll('.userfied-link').forEach(function (el) {
    el.href += queryString
  })

  document.querySelectorAll('.nav-link').forEach(function (el) {
    el.href += queryString
  })
})

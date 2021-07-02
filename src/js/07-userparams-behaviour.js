document.addEventListener('DOMContentLoaded', function () {

  // If there is a query string, we need to fix up the page to make sure the query string is properly preserved
  var desiredQueryString = new URLSearchParams(window.location.search)
  if (desiredQueryString.toString()) {
    preserveQueryString(desiredQueryString)
    // If there are query parameters (searchparams) in the current window location
    // then iterate over all them replacing text and link-hrefs that contain them
    for (var k of desiredQueryString.keys()) {
      replaceParamsInNodes(document.body, k, desiredQueryString.get(k))
    }
  }

  function preserveQueryString (desiredQueryString) {
    //Handle links
    var allQueryParamLinks = document.querySelectorAll('.query-params-link, .home-link, .params-link, .nav-link')
    if (allQueryParamLinks) {
      allQueryParamLinks.forEach(appendQueryStringToHref)
    }

    // Handle breadcrumb navigation links
    var paramLinks = document.querySelectorAll('.breadcrumbs ul li a')
    if (paramLinks) {
      paramLinks.forEach(appendQueryStringToHref)
    }
  }

  function appendQueryStringToHref (el) {
    // NOTE: desiredQueryString captured from above
    if (desiredQueryString.toString()) {
      var hrefURL = new URL(el.href)
      for (var k of desiredQueryString.keys()) {
        hrefURL.searchParams.set(k, desiredQueryString.get(k))
      }

      el.href = hrefURL.toString()
    }
  }

  // refreshing links

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

      // handle link elements
      if (node.href) {
        node.href = applyPattern(node.href, key, value)
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

var http = require('http')
var fs = require('fs')
var url = require('url')
var template = require('art-template')

var comments = '{}'

fs.readFile('./db.json', function (err, data) {
  if (err) {
    return res.end('没有找到数据')
  }
  comments = JSON.parse(data)
})

http.createServer(function (req, res) {
  var parseObj = url.parse(req.url, true)
  var pathname = parseObj.pathname
  if (pathname === '/') {
    fs.readFile('./views/index.html', function (err, data) {
      if (err) {
        return res.end('404 Not Found.')
      }
      var htmlStr = template.render(data.toString(), comments)
      res.end(htmlStr)
    })
  } else if (pathname === '/post') {
    fs.readFile('./views/post.html', function (err, data) {
      if (err) {
        return res.end('404 Not Found.')
      }
      res.end(data)
    })
  } else if (pathname.indexOf('/public/') === 0) {
    fs.readFile('.' + pathname, function (err, data) {
      if (err) {
        return res.end('404 Not Found.')
      }
      res.end(data)
    })
  } else if (pathname === '/pinglun') {
  	fs.readFile('./db.json', function (err, data) {
      if (err) {
        return res.end('没有找到数据')
      }
      var comment = parseObj.query
      comment.dateTime = '2018-11-23'
      comments = JSON.parse(data)
      comments.student.unshift(comment)
      console.log(comments)
      fs.writeFile('./db.json', comments, function (error) {
		  if (error) {
		    return res.end('存储失败')
		  } else {
		    res.statusCode = 302
		    res.setHeader('Location', '/')
		    res.end()
		  }
      })
    })
  } else {
    // 其它的都处理成 404 找不到
    fs.readFile('./views/404.html', function (err, data) {
      if (err) {
        return res.end('404 Not Found.')
      }
      res.end(data)
    })
  }
}).listen(3000, function () {
  console.log('running...')
})

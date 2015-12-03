import express from 'express'
import parser from 'body-parser'
import logger from 'morgan'
import path from 'path'
import button from '../methods/button'
import index from '../routes/index'
import slash from '../routes/slash'
import install from '../routes/install'

let bb = express()

// default template locals
bb.locals.ok = true
bb.locals.msg = ''
bb.locals.button = button

// default views
bb.set('view engine', 'ejs')
bb.set('views', path.join(__dirname, '..', 'views'))

// override view settings for parent app
bb.on('mount', parent=> {
  bb.set('view engine', parent.get('view engine'))
  bb.set('views', parent.get('views'))
})

function validateEnv(req, res, next) {
  let required = 'NODE_ENV APP_NAME SLACK_CLIENT_ID SLACK_CLIENT_SECRET'.split(' ')
  let allGood = true
  for (var i = 0; i < required.length; i++) {
    if (typeof process.env[required[i]] === 'undefined') {
      allGood = false
      break
    }
  }
  if (allGood) {
    next() 
  }
  else {
    res.status(500).json({err:'missing env vars in slack-express'})
  }
}

// middlewares
bb.use(validateEnv)
bb.use(logger('dev'))
bb.use(parser.json())
bb.use(parser.urlencoded({extended:true}))

// default routes
bb.get('/', index)
bb.post('/', slash)
bb.get('/auth', install)

export default bb

/* eslint-disable no-console */
import { createServer } from 'node:http'
import process from 'node:process'
import main from './main.js'

const PORT = process.env.PORT || 6870

createServer(main).listen(PORT, () => {
  console.log('Start...')
  console.log(`Service is up and running port: ${PORT}`)
})

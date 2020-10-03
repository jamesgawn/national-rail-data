const { describe, it, beforeEach, before, after } = require('mocha')
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const sinon = require('sinon')
const nock = require('nock')
const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const RailData = require('../index')

describe('RailData', () => {
  let railData
  let user
  let pass
  before(() => {
    nock.disableNetConnect()
  })
  beforeEach(() => {
    user = 'testuser'
    pass = 'testpass'
    railData = new RailData(user, pass)
    railData._log = {
      error: sinon.spy()
    }
  })
  describe('constructor', () => {
    it('should persist credentials for use in query', () => {
      expect(railData._user).to.equal(user)
      expect(railData._pass).to.equal(pass)
    })
  })
  describe('_refreshAuthToken', () => {
    it('should request a token from service with valid credentials', async () => {
      let response = require('./examples/authenticate.json')
      nock('https://opendata.nationalrail.co.uk').post('/authenticate', {
        username: user,
        password: pass
      }).reply(200, JSON.stringify(response))
      await railData._refreshAccessToken()
      expect(railData._token).to.deep.equal(response)
    })
    it('should handle and log error when requesting a token from service with invalid credentials', async () => {
      nock('https://opendata.nationalrail.co.uk').post('/authenticate', {
        username: user,
        password: pass
      }).reply(401)
      let error
      try {
        await railData._refreshAccessToken()
      } catch (err) {
        error = err
      }
      expect(error.message).to.equal('Unable to obtain token to access national rail data feeds. Consider checking the provided username and password.')
      expect(railData._token).to.equal(undefined)
      expect(railData._log.error).to.be.calledWith(sinon.match.any, 'Unable to obtain token to access national rail data feeds.')
    })
  })
  describe('_refreshAuthToken', () => {
    it('should trigger a refresh if token is blank', async () => {
      railData._refreshAccessToken = sinon.spy()
      await railData._refreshAccessTokenIfRequired()
      expect(railData._refreshAccessToken).to.have.callCount(1)
    })
    it('should not trigger a refresh if token is populated', async () => {
      railData._refreshAccessToken = sinon.spy()
      railData._token = 'notblank'
      await railData._refreshAccessTokenIfRequired()
      expect(railData._refreshAccessToken).to.have.callCount(0)
    })
  })
  describe('getStations', () => {
    it('should retrieve stations', async () => {
      railData._token = {
        token: 'testtoken'
      }
      let response = fs.readFileSync(path.resolve(__dirname, './examples/stations/rawStationsSample.xml')).toString()
      let expectedResult = require('./examples/stations/stations')
      nock('https://opendata.nationalrail.co.uk', {
        reqheaders: {
          'X-Auth-Token': railData._token.token
        }
      }).get('/api/staticfeeds/4.0/stations').reply(200, response)
      let stations = await railData.getStations()
      expect(stations).to.deep.equal(expectedResult)
    })
  })
  after(() => {
    nock.enableNetConnect()
  })
})

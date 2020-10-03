const { describe, it } = require('mocha')
const expect = require('chai').expect
const StationAdapter = require('../../../lib/adapter/station-adapter')

describe('StationAdapter', () => {
  describe('dtoToModel', () => {
    it('should translate approprite fields', () => {
      let dto = {
        CrsCode: 'GNW',
        Name: 'Greenwich',
        Latitude: 132,
        Longitude: 456,
        StationOperator: 'ABC'
      }
      let expectedModel = {
        crsCode: 'GNW',
        name: 'Greenwich',
        latitude: 132,
        longitude: 456,
        stationOperator: 'ABC'
      }
      let model = StationAdapter.dtoToModel(dto)
      expect(model).to.deep.equal(expectedModel)
    })
  })
})

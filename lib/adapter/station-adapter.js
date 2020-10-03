class StationAdapter {
  static dtoToModel (stationDto) {
    return {
      crsCode: stationDto.CrsCode,
      name: stationDto.Name,
      latitude: stationDto.Latitude,
      longitude: stationDto.Longitude,
      stationOperator: stationDto.StationOperator
    }
  }
}
module.exports = StationAdapter

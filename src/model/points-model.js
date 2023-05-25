export default class PointsModel {
  constructor(service) {
    this.service = service;
    this.points = this.service.points;
  }

  get() {
    return this.points;
  }
}

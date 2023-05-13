import TripListView from '../view/trip-list-view.js';
import TripEventView from '../view/trip-event.js';
import EditFormView from '../view/edit-form-view.js';

import {render} from '../render.js';

export default class TripPresenter {
  tripListComponent = new TripListView();

  constructor({tripContainer, destinationsModel, offersModel, pointsModel}) {
    this.tripContainer = tripContainer;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.get()];
    render(this.tripListComponent, this.tripContainer);

    render(
      new EditFormView({
        point: this.points[0],
        pointDestinations: this.destinationsModel.get(),
        pointOffers: this.offersModel.get(),
      }),
      this.tripListComponent.getElement()
    );


    this.points.forEach((point) => {
      render(
        new TripEventView({
          point,
          pointDestinations: this.destinationsModel.getById(point.destination),
          pointOffers: this.offersModel.getByType(point.type)
        }),
        this.tripListComponent.getElement()
      );
    });
  }
}

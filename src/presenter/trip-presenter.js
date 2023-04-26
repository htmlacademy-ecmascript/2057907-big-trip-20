import TripListView from '../view/trip-list-view.js';
import TripEventView from '../view/trip-event.js';
import EditFormView from '../view/edit-form-view.js';
import AddEventFormView from '../view/add-event-form.js';
import {render} from '../render.js';

export default class TripPresenter {
  tripListComponent = new TripListView();

  constructor({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(this.tripListComponent, this.tripContainer);
    render(new EditFormView(), this.tripListComponent.getElement());
    render(new AddEventFormView(), this.tripListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripEventView(), this.tripListComponent.getElement());
    }
  }
}

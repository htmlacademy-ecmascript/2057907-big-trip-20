import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {POINT_EMPTY, TYPES} from '../const.js';
import dayjs from 'dayjs';
import {capitalize} from '../utils/point.js';

const createEventTypeTemplate = (type) => {
  const value = capitalize(type);

  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${value}</label>
    </div>`
  );
};

function createEditFormTemplate({point, pointDestinations, pointOffers}) {
  const {basePrice, type, destination, dateFrom, dateTo} = point;

  function createPictureTemplate(pictures) {
    return pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="Event photo">`).join('');
  }

  const eventTypeMarkup = TYPES.map(createEventTypeTemplate).join('');

  const isChecked = (offer) => point.offers.includes(offer.id) ? 'checked' : '';


  const concreteOffers = pointOffers.find((offer) => offer.type === type).offers;

  const offersList = concreteOffers
    .map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${offer.title}" ${isChecked(offer)}>
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`)
    .join('');

  return (`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
             ${eventTypeMarkup}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${point.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestinations.find((el) => el.id === destination).name}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${pointDestinations.map((city) => (`<option value="${city.name}"></option>`)).join(' ')}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offersList}
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestinations.find((el) => el.id === destination).description}</p>

        <div class="event__photos-container">
            <div class="event__photos-tape">
            ${createPictureTemplate(pointDestinations.find((el) => el.id === destination).pictures)}
            </div>
        </div>
      </section>
    </section>
  </form>
</li>
  `
  );
}

export default class EditFormView extends AbstractStatefulView {
  #pointDestinations = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({point = POINT_EMPTY, pointDestinations, pointOffers, onFormSubmit}) {
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;
    this.#handleFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate({
      point: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers
    });
  }

  reset = (point) => this.updateElement(point);

  _restoreHandlers = () => {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formSubmitHandler);

    this.element.querySelector('.event__type-btn')
      .addEventListener('click', this.#chooseTripPointTypeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);

    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerClickHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputChange);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #chooseTripPointTypeHandler = (evt) => {
    evt.preventDefault();
    this.element.querySelector('.event__type-toggle').setAttribute('checked', 'true');
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();
    const newOffer = evt.target.checked ? [...this._state.offers, evt.target.id] : this._state.offers.filter((offer) => offer !== evt.target.id);
    this.updateElement({
      offers: newOffer
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #destinationInputChange = (evt) => {
    const selectedDestination = this.#pointDestinations.find((destination) => destination.name === evt.target.value);
    if (selectedDestination) {
      this.updateElement({
        destination: selectedDestination.id,
      });
    }
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    const point = {...state};

    return point;
  }
}

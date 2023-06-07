import {render, RenderPosition} from './framework/render.js';
import TripInfoView from './view/trip-info.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventElement = document.querySelector('.trip-events');
const siteTripMainElement = document.querySelector('.trip-main');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const filterPresenter = new FilterPresenter({
  container: siteFilterElement,
  pointsModel
});

const tripPresenter = new TripPresenter({
  tripContainer: siteTripEventElement,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new TripInfoView(), siteTripMainElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
tripPresenter.init();

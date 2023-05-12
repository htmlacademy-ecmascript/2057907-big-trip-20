import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import TripInfoView from './view/trip-info.js';
import {render, RenderPosition} from './render.js';
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


const tripPresenter = new TripPresenter({
  tripContainer: siteTripEventElement,
  destinationsModel,
  offersModel,
  pointsModel
});

render(new TripInfoView(), siteTripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), siteFilterElement);
render(new SortView(),siteTripEventElement);


tripPresenter.init();

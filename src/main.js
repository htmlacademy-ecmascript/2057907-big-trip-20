import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import TripInfoView from './view/trip-info.js';
import {render} from './render.js';
import {RenderPosition} from './render.js';
import TripPresenter from './presenter/trip-presenter.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripEventElement = document.querySelector('.trip-events');
const siteTripMainElement = document.querySelector('.trip-main');
const tripPresenter = new TripPresenter({tripContainer: siteTripEventElement});

render(new TripInfoView(), siteTripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), siteFilterElement);
render(new SortView(),siteTripEventElement);


tripPresenter.init();

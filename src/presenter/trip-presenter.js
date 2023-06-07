import {render, RenderPosition, replace, remove} from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import NoPointView from '../view/no-point-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../const.js';
import {sort} from '../utils/sort.js';

export default class TripPresenter {
  #tripContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #sortComponent = null;

  #tripListComponent = new TripListView();

  #points = [];
  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();

  constructor({tripContainer, destinationsModel, offersModel, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = sort[SortType.DAY]([...this.#pointsModel.get()]);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderSort = (container) => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, container, RenderPosition.AFTERBEGIN);
    }
  };

  #renderPointContainer = () => {
    this.#tripListComponent = new TripListView();
    render(this.#tripListComponent, this.#tripContainer);
  };

  #renderBoard = () => {
    if (this.#points.length === 0) {
      render(new NoPointView(), this.#tripContainer);
      return;
    }

    this.#renderSort(this.#tripContainer);
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderSort(this.#tripContainer);
    this.#renderPoints();
  };
}

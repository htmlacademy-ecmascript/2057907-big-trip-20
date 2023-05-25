import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '../utils/point.js';

function createFilterItem(filter, isChecked) {
  return `
    <div class="trip-filters__filter">
    <input
      id="filter-${filter.type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filter.type}"
      ${isChecked === 0 ? 'checked' : ''}
      ${(filter.hasPoints) ? '' : 'disabled'}/>
    <label class="trip-filters__filter-label"
    for="filter-${filter.type}">${capitalize(filter.type)}</label>
  </div>
  `;
}

function createFilterTemplate(filters) {
  return (`
    <form class="trip-filters" action = "#" method = "get">
      ${filters.map(createFilterItem).join('')}
      <button  class="visually-hidden"  type="submit">Accept filter</button>
    </form >
    `);
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}

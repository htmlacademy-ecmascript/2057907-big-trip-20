import {getRandomInteger} from '../utils/common.js';
import {Price} from './const.js';
import {getDate} from './utils.js';

function generatePoint(type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({next: false}),
    dateTo: getDate({next: true}),
    destination: destinationId,
    isFavourite: !!getRandomInteger(0, 1),
    offers: offerIds,
    type
  };
}

export {generatePoint};

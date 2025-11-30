import { CardWidget } from '../js/cardWidget/CardWidget.js';


console.log("app.js included");

document.addEventListener('DOMContentLoaded', () => {
  new CardWidget('.card-widget');
})


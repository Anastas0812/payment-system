import { CardValidator } from "./CardValidator.js";
import { CardSystemIdentifier } from "./CardSystemIdentifier.js";


export class CardWidget {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.cardIconsContainer = this.container.querySelector('.cards-img');
    this.input = this.container.querySelector('input');
    this.button = this.container.querySelector('.button');

    this.validator = new CardValidator();
    this.systemIdentifier = new CardSystemIdentifier();

    this.cardTypes = this.systemIdentifier.getSupportedSystems(); //получаем массив с названиями платежных систем
    this.init();
  }

  init() {
    this.createCardIcons();
    this.setupEventListeners();
  }

  createCardIcons() {
    this.cardTypes.forEach(cardName => {
      const icon = document.createElement('img');
      icon.className = 'card-icon inactive';
      icon.src = `img/${cardName}.png`;
      icon.alt = cardName;
      icon.dataset.cardType = cardName;

      this.cardIconsContainer.append(icon);
    });
  }

  setupEventListeners() {
    this.input.addEventListener('input', (e) => {
      this.handleCardInput(e.target.value);
    });

    this.button.addEventListener('click', () => {
      this.validateCard();
    });
  }

  handleCardInput(cardNumber) {
    const validationResult = this.validator.validate(cardNumber);
    if (validationResult.isValid) {
      const systemResult = this.systemIdentifier.identify(validationResult.cleanedNumber);

      if (systemResult.found) {
        this.highlightCardSystem(systemResult.system);
      } else {
        this.resetCardIcons();
      }
    } else {
      this.resetCardIcons();
    }

    this.formatCardInput(cardNumber);
  }

  highlightCardSystem(systemName) {
    this.resetCardIcons();
    const targetIcon = this.cardIconsContainer.querySelector(`[data-card-type="${systemName}"]`);
    if (targetIcon) {
      targetIcon.classList.remove('inactive');
      targetIcon.classList.add('active');
    }
  }
  
  resetCardIcons() {
    const allIcons = this.cardIconsContainer.querySelectorAll('.card-icon');
    allIcons.forEach(icon => {
      icon.classList.remove('active');
      icon.classList.add('inactive');
    });
  }

  formatCardInput(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();

    if (this.input.value !== formatted) {
      this.input.value = formatted;
    }
  }

  validateCard() {
    const cardNumber = this.input.value.replace(/\D/g, '');
    const validationResult = this.validator.validate(cardNumber);

    if (validationResult.isValid) {
      const systemResult = this.systemIdentifier.identify(validationResult.cleanedNumber);
      
      if (systemResult.found) {
        alert(`Карта ${systemResult.details.displayName || systemResult.system} валидна!`);
      } else {
        alert('Номер карты валиден, но платежная система не определена');
      }
    } else {
      alert(`${validationResult.error || 'Неверный номер карты'}`);
    }
  }
}
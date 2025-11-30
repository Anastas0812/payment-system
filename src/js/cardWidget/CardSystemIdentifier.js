export class CardSystemIdentifier {
  constructor() {
    this.cardSystems = [
      { 
        name: 'american-express', //Начинается с: 34 или 37
        pattern: /^3[47]/,
        lengths: [15]
      },
      { 
        name: 'maestro', //Начинается с: 5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763
        pattern: /^(5018|5020|5038|5893|6304|6759|676[1-3])/,
        lengths: [12, 13, 14, 15, 16, 17, 18, 19]
      },
      { 
        name: 'mir', //Начинается с: 2
        pattern: /^2\d/,
        lengths: [16, 17, 18, 19]
      },
      { 
        name: 'mastercard', //Начинается с: 51-55 или 2221-2720
        pattern: /^(5[1-5]|2[2-7][0-9]{2})/,
        lengths: [16]
      },
      { 
        name: 'unionpay', //Начинается с: 62
        pattern: /^62/,
        lengths: [16, 17, 18, 19]
      },
      { 
        name: 'visa', //Начинается с: 4
        pattern: /^4/,
        lengths: [13, 16, 19]
      },
      
    ];
  }

 
  identify(cardNumber) {
    if (!cardNumber || !/^\d+$/.test(cardNumber)) { //
      return {
        system: null,
        found: false,
        error: 'Неверный формат номера карты'
      };
    }

    for (let system of this.cardSystems) {
      if (system.pattern.test(cardNumber) && 
          system.lengths.includes(cardNumber.length)) {
        return {
          system: system.name,
          found: true,
          error: null,
          details: system
        };
      }
    }

    return {
      system: null,
      found: false,
      error: 'Платежная система не определена'
    };
  }

  getSupportedSystems() {
    return this.cardSystems.map(system => system.name);
  }

  isSystemSupported(systemName) {
    return this.cardSystems.some(system => system.name === systemName);
  }
}
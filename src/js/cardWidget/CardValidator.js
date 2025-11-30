export class CardValidator {
  constructor() {
  }

  validate(rawCardNumber) {
    const cleaned = this.cleanCardNumber(rawCardNumber);
    const preValidation = this.preValidate(cleaned);
    
    if (!preValidation.isValid) {
      return preValidation;
    }

    const luhnResult = this.luhnCheck(cleaned);
    return {
      isValid: luhnResult,
      cleanedNumber: cleaned,
      error: luhnResult ? null : 'Неверный номер карты',
      details: {
        length: cleaned.length,
        preValidation: preValidation
      }
    };
  }

  cleanCardNumber(cardNumber) {
    return cardNumber.replace(/\D/g, ''); //НЕ цифры удаляем, регулярка
  }

  preValidate(cardNumber) {
    if (!cardNumber) {
      return { isValid: false, error: 'Номер карты не может быть пустым' };
    }

    if (!/^\d+$/.test(cardNumber)) {
      return { isValid: false, error: 'Номер карты должен содержать только цифры' };
  }

    if (cardNumber.length < 12) {
      return { isValid: false, error: 'Номер карты слишком короткий' };
    }

    if (cardNumber.length > 19) {
      return { isValid: false, error: 'Номер карты слишком длинный' };
    }

    return { isValid: true, error: null };
  }


  luhnCheck(cardNumber) {
    let sum = 0;
    let isEvenPosition = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        if (isEvenPosition) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isEvenPosition = !isEvenPosition;
    }

    return sum % 10 === 0;
  }
}
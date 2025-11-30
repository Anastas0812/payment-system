import { CardValidator } from '../cardWidget/CardValidator.js'

describe('CardValidator', () => {
  test('should validate correct card number', () => {
    const validator = new CardValidator();
    expect(validator.cleanCardNumber('23 32 dff666 89272111')).toBe('233266689272111');
  });

  test('isValid true - preValidate', () => {
    const validator = new CardValidator();
    expect(validator.preValidate('233266689272111')).toEqual({ isValid: true, error: null });
  });

  test('isValid false - preValidate, for "" ', () => {
    const validator = new CardValidator();
    expect(validator.preValidate('')).toEqual({ isValid: false, error: 'Номер карты не может быть пустым' });
  });

  test('isValid false - preValidate, for number with letters ', () => {
    const validator = new CardValidator();
    expect(validator.preValidate('hello')).toEqual({ isValid: false, error: 'Номер карты должен содержать только цифры' });
  });

  test('isValid false - preValidate, for short number', () => {
    const validator = new CardValidator();
    expect(validator.preValidate('123')).toEqual({ isValid: false, error: 'Номер карты слишком короткий' });
  });

  test('isValid false - preValidate, for long number', () => {
    const validator = new CardValidator();
    expect(validator.preValidate('123456789012345671111')).toEqual({ isValid: false, error: 'Номер карты слишком длинный' });
  });

  test('luhnCheck should be true', () => {
    const validator = new CardValidator();
    expect(validator.luhnCheck('4320678821029269')).toBeTruthy();
  });

  test('luhnCheck should be false', () => {
    const validator = new CardValidator();
    expect(validator.luhnCheck('1111111111111111')).toBeFalsy();
  });

  test('validate with wrong number ', () => {
    const validator = new CardValidator();
    expect(validator.validate('1111')).toEqual({ isValid: false, error: 'Номер карты слишком короткий' });
  });

  test('validate with correct number ', () => {
    const validator = new CardValidator();
    expect(validator.validate('4320678821029269')).toHaveProperty('isValid', 'true', 'cleanedNumber', 'length');
  });
});
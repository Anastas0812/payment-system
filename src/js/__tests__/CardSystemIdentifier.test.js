import { CardSystemIdentifier } from '../cardWidget/CardSystemIdentifier.js';


describe('CardSystemIdentifier', () => {
  test('identify - empty card number', () => {
    const identifier = new CardSystemIdentifier();
    expect(identifier.identify('')).toEqual({
      system: null,
      found: false,
      error: 'Неверный формат номера карты'
    });
  });

  test('identify - card number with letter', () => {
    const identifier = new CardSystemIdentifier();
    expect(identifier.identify('hello')).toEqual({
      system: null,
      found: false,
      error: 'Неверный формат номера карты'
    });
  });

  test('identify - wrong pay system', () => {
    const identifier = new CardSystemIdentifier();
    expect(identifier.identify('8888888888888888')).toEqual({
      system: null,
      found: false,
      error: 'Платежная система не определена'
    });
  });

  test('identify - correct number card Visa', () => {
    const identifier = new CardSystemIdentifier();
    expect(identifier.identify('4111111111111111')).toEqual({
      system: 'visa',
      found: true,
      error: null,
      details: { 
        name: 'visa',
        pattern: /^4/,
        lengths: [13, 16, 19]
      }
    });
  });

  test('should contain system name', () => {
    const identifier = new CardSystemIdentifier();
    const systems = identifier.getSupportedSystems();
    
    expect(systems).toContain('visa');
    expect(systems).toContain('mastercard');
    expect(systems).toContain('mir');
    expect(systems).toHaveLength(6);
  });

  test('isSystemSupported returns true for existing systems', () => {
    const identifier = new CardSystemIdentifier();
    expect(identifier.isSystemSupported('visa')).toBeTruthy() ;
    expect(identifier.isSystemSupported('mastercard')).toBeTruthy();
});

  test('isSystemSupported returns false for unknown systems', () => {
      const identifier = new CardSystemIdentifier();
      expect(identifier.isSystemSupported('bitcoin')).toBeFalsy();
      expect(identifier.isSystemSupported('paypal')).toBeFalsy();
  });

});
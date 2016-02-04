import {encoder} from '../src/encoder'

describe('Encoder', () => {

  describe('encode', () => {
    it('should encode string', () => {
      expect(encoder.encode('upfindertest')).toBe('dXBmaW5kZXJ0ZXN0');
    });
  });

  describe('decode', () => {
    it('should decode string', () => {
      expect(encoder.decode('dXBmaW5kZXJ0ZXN0')).toBe('upfindertest');
    });
  });

});
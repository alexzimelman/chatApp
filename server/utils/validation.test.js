const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString function', () => {
  it('should reject non-string values', () => {
    var res = isRealString(123);
    expect(res).toBe(false);
  });
  it('should reject string with only spaces', () => {
    var res = isRealString('     ');
    expect(res).toBe(false);
  });
  it('should allowed string with non-space characters', () => {
    var res = isRealString('  alex  ');
    expect(res).toBe(true);
  });
});

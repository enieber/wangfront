import { backIndex, nextIndex } from './slide'

describe('test slide mode index', () => {
  describe('test backIndex function', () => {
    it('it is ismoke test', () => {
      expect(backIndex).not.toBeUndefined();
    })
    //{0,1,2,3}{0-1, 0-2, 0-3, 0-4}
    //{9,0,1,2}
    //{8,9,0,1}
    describe('test backIndex with 10 items', () => {
      it('should return 1 when lenght is 10 and index is 2', () => {
        expect(backIndex(10, 2)).toEqual(1)
      })
      it('should return 2 when lenght is 10 and index is 3', () => {
        expect(backIndex(10, 3)).toEqual(2)
      })
      it('should return 0 when lenght is 10 and index is 1', () => {
        expect(backIndex(10, 1)).toEqual(0)
      })
      it('should return 9 when lenght is 10 and index is 0', () => {
        expect(backIndex(10, 0)).toEqual(9)
      })
      // it('should return 2 when lenght is 9 and index is -4', () => {
      //   expect(backIndex(9, -4)).toEqual(2)
      // })
    })
  })
  describe('test nextIndex function', () => {
    it('it is ismoke test', () => {
      expect(nextIndex).not.toBeUndefined();
    })
    it('should return 1 when lenght is 3 and index is 0', () => {
      expect(nextIndex(3, 0)).toEqual(1)
    })
    it('should return 2 when lenght is 3 and index is 1', () => {
      expect(nextIndex(3, 1)).toEqual(2)
    })
    it('should return 0 when lenght is 3 and index is 2', () => {
      expect(nextIndex(3, 2)).toEqual(0)
    })
  })
})


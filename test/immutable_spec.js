import {expect} from 'chai'
import {List, Map} from 'immutable'

describe('immutability', () => {

  describe('a number', () => {

    function increment(currentState) {
      return currentState + 1
    }

    it('is immutable', () => {
      const state = 42
      const nextState = increment(state)

      expect(nextState).to.equal(43)
      expect(state).to.equal(42)
    })
  })

  describe('a list', () => {

    function addMovie(currentState, movie) {
      return currentState.push(movie)
    }

    it('is immutable', () => {
      const state = List.of('a', 'b', 'c')
      const nextState = addMovie(state, 'd')

      expect(nextState).to.equal(List.of('a', 'b', 'c', 'd'))
      expect(state).to.equal(List.of('a', 'b', 'c'))
    })
  })

  describe('a tree', () => {

    function addMovie(currentState, movie) {
      return currentState.update('movies', movies => movies.push(movie))
    }

    it('is immutable', () => {
      const state = Map({
        movies: List.of('a', 'b')
      })
      const nextState = addMovie(state, 'c')

      expect(state).to.equal(Map({
        movies: List.of('a', 'b')
      }))
      expect(nextState).to.equal(Map({
        movies: List.of('a', 'b', 'c')
      }))
    })
  })
})

import { expect } from 'chai';
import { fromJS } from 'immutable';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = fromJS({});
      const entries = ['a', 'b'];
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(fromJS({
        entries: ['a', 'b'],
      }));
    });
  });

  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const state = fromJS({
        entries: ['a', 'b', 'c'],
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        entries: ['c'],
        vote: {
          pair: ['a', 'b'],
        },
      }));
    });

    it('puts winner of current vote back to entries', () => {
      const state = fromJS({
        entries: ['c'],
        vote: {
          pair: ['a', 'b'],
          tally: {
            a: 2,
            b: 3,
          },
        },
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        entries: [],
        vote: {
          pair: ['c', 'b'],
        },
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = fromJS({
        entries: ['c'],
        vote: {
          pair: ['a', 'b'],
          tally: {
            a: 2,
            b: 2,
          },
        },
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        entries: ['b'],
        vote: {
          pair: ['c', 'a'],
        },
      }));
    });

    it('marks winner when just one entry left', () => {
      const state = fromJS({
        entries: [],
        vote: {
          pair: ['a', 'b'],
          tally: {
            a: 3,
            b: 2,
          },
        },
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        winner: 'a',
      }));
    });
  });

  describe('vote', () => {
    it('creates a tally for voted entry', () => {
      const state = fromJS({
        pair: ['a', 'b'],
      });
      const nextState = vote(state, 'a');

      expect(nextState).to.equal(fromJS({
        pair: ['a', 'b'],
        tally: {
          a: 1,
        },
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = fromJS({
        pair: ['a', 'b'],
        tally: {
          a: 1,
          b: 3,
        },
      });
      const nextState = vote(state, 'a');

      expect(nextState).to.equal(fromJS({
        pair: ['a', 'b'],
        tally: {
          a: 2,
          b: 3,
        },
      }));
    });
  });
});

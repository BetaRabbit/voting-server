import fromJS from 'immutable';
import expect from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {
  it('handles SET_ENTRIES', () => {
    const state = fromJS({});
    const nextState = reducer(state, {
      type: 'SET_ENTRIES',
      entries: fromJS(['a', 'b']),
    });

    expect(nextState).to.equal(fromJS({
      entries: ['a', 'b'],
    }));
  });

  it('handles NEXT', () => {
    const state = fromJS({
      entries: ['a', 'b'],
    });
    const nextState = reducer(state, {
      type: 'NEXT',
    });

    expect(nextState).to.equal(fromJS({
      entries: [],
      vote: {
        pair: ['a', 'b'],
      },
    }));
  });

  it('handles VOTE', () => {
    const state = fromJS({
      entries: [],
      vote: {
        pair: ['a', 'b'],
      },
    });
    const nextState = reducer(state, {
      type: 'VOTE',
      entry: 'a',
    });

    expect(nextState).to.equal(fromJS({
      entries: [],
      vote: {
        pair: ['a', 'b'],
        tally: {
          a: 1,
        },
      },
    }));
  });

  it('has a initial state', () => {
    const nextState = reducer(undefined, {
      type: 'SET_ENTRIES',
      entries: ['a', 'b'],
    });

    expect(nextState).to.equal(fromJS({
      entries: ['a', 'b'],
    }));
  });

  it('can be used with reducer', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['a', 'b']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'a'},
      {type: 'VOTE', entry: 'b'},
      {type: 'VOTE', entry: 'a'},
      {type: 'NEXT'},
    ];
    const nextState = actions.reduce(reducer, fromJS({}));

    expect(nextState).to.equal(fromJS({
      winner: 'a',
    }));
  });
});

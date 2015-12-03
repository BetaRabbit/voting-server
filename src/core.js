import { fromJS } from 'immutable';

export const INITIAL_STATE = fromJS({});

export function setEntries(state, entries) {
  return state.set('entries', fromJS(entries));
}

function getWinner(voteState) {
  if (!voteState) {
    return [];
  }

  const [a, b] = voteState.get('pair');
  const aVotes = voteState.getIn(['tally', a], 0);
  const bVotes = voteState.getIn(['tally', b], 0);

  if (aVotes > bVotes) {
    return [a];
  } else if (aVotes < bVotes) {
    return [b];
  }

  return [a, b];
}

export function next(state) {
  const entries = state.get('entries')
                 .concat(getWinner(state.get('vote')));

  if (entries.size === 1) {
    return state.remove('entries')
                .remove('vote')
                .set('winner', entries.first());
  }

  return state.merge({
    vote: {
      pair: entries.take(2),
    },
    entries: entries.skip(2),
  });
}

export function vote(voteState, entry) {
  return voteState.updateIn(['tally', entry], 0, tally => tally + 1);
}

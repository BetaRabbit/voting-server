import fromJS from 'immutable';

export const INITIAL_STATE = fromJS({});

export function setEntries(state, entries) {
  return state.set('entries', fromJS(entries));
}

function getWinner(voteInfo) {
  if (!voteInfo) {
    return [];
  }

  const [a, b] = voteInfo.get('pair');
  const aVotes = voteInfo.getIn(['tally', a], 0);
  const bVotes = voteInfo.getIn(['tally', b], 0);

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

export function vote(state, entry) {
  return state.updateIn(['vote', 'tally', entry], 0, tally => tally + 1);
}

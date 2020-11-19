import { createStore, combineReducers, applyMiddleware } from "redux";

// simplest possible logger
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("store message:", action);
  return next(action);
};

// allow views / controllers to subscript to changes in parts of the state
// for now, those changes are restricted to top level keys, but this 
// could be expanded to more complex json selectors
function subscribeMiddleware({ dispatch, getState }) {
  const paths = [];
  const subscriptions = {};

  return (next) => (action) => {
    switch (action.type) {
      case "SUBSCRIBE": {
        const { path, key, fn } = action.payload;
        subscriptions[path] = subscriptions[path] || {};
        subscriptions[path][key] = fn;
        if (paths.indexOf(path) === -1) {
          paths.push(path);
        }
        break;
      }
      case "UNSUBSCRIBE": {
        const { path, key } = action.payload;
        const subs = subscriptions[path];

        if (subs) {
          delete subs[key];
          if (Object.keys(subs).length === 0) {
            delete subscriptions[path];
            paths.splice(paths.indexOf(path), 1);
          }
        }

        break;
      }
      default: {
        const prevState = getState();
        const result = next(action);
        const nextState = getState();

        paths.forEach((path) => {
          const prev = prevState[path]; // TODO deal with nested later
          const next = nextState[path]; // TODO deal with nested later

          if (prev !== next) {
            Object.keys(subscriptions[path]).forEach(k => {
              let fn = subscriptions[path][k]
              fn({ path, prev, next });
            });
          }
        });

        return result;
      }
    }
  };
}

/*
  state = {
      id1: _partModel1,
      id2: _partModel2,
  }
*/
function partReducer(state = {}, action) {
  switch (action.type) {
    case "addPart": {
      return { ...state, [action.id]: action.part };
    }
    default:
      return state;
  }
}

/*
  state = [id1, id 2] -- set of ids which are "current"
*/
function currentStackReducer(state = [], action) {
  switch (action.type) {
    case "setCurrentStack": {
      let next = state;
      if (!state.includes(action.idToAdd)) {
          next = [...state, action.idToAdd];
      }
      if (action.idToRemove && next.includes(action.idToRemove)) {
          next = next.filter(e => e != action.idToRemove)
      }
      return next;
    }
    default:
      return state;
  }
}

/*
  state = [id1, id2] -- set of ids which are "current"
*/
function currentCardReducer(state = [], action) {
  switch (action.type) {
    case "setCurrentCard": {
      let next = state;
      if (!state.includes(action.idToAdd)) {
          next = [...state, action.idToAdd];
      }
      if (action.idToRemove && next.includes(action.idToRemove)) {
          next = next.filter(e => e != action.idToRemove)
      }
      return next;
    }
    default:
      return state;
  }
}

var reducer = combineReducers({
  currentCards: currentCardReducer,
  currentStacks: currentStackReducer,
  parts: partReducer,
});
const store = createStore(
  reducer,
  applyMiddleware(loggerMiddleware, subscribeMiddleware)
);

export default store;

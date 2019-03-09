const reducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD':
      let arr = [];
      let ids = [];
      if (state.length) {
        state.map(user => {
            if (user.removed || user.loaded) {
            ids.push(user.id);
          } else {
            arr.push(user);
          }
        });
        if (Array.isArray(action.users)){
          action.users.map(user => {
            if(ids.indexOf(user.id) === -1){
              user.loaded = true;
              arr.push(user);
            }
          });
        } else {
          if (!action.users.loaded || !action.users.updated){
            action.users.loaded = true;
            arr.push(action.users);
          }
        }
        state = arr;
      } else {
        state = Array.isArray(action.users) ? action.users : [action.users];
      }
      return state;

    case 'DELETE':
      let arr3 = [];
      state.map(user => {
        if (user.id === action.id) {
          user.removed = true;
        }
        arr3.push(user);
      });
      state = arr3;
      return state;
    
    case 'UPDATE':
      let arr2 = [];
      state.map(user => {
        if(action.users.id.toString() === user.id.toString()){
          user = action.users;
          user.updated = true;
        } 
        arr2.push(user);
      });
      state = arr2;
      return state;
      
    case 'NEW' : 
      return state.push(action.users);
    default:
      return state;
  }
}

export default reducer;
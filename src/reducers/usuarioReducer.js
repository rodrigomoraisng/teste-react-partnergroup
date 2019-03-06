const userReducer = (state = [], action) => {
  switch (action.type) {

    case 'NEW_USER':
      return state.concat([action.user]);

    case 'REMOVE_USER':
      return state.filter(user => user.id !== action.id);

    case 'EDIT_USER':
      return state.map(user => user.id === action.id ? { ...user, editting: !user.editting } : user);

    case 'POST_FORM_DATA':
      return state.concat([action]);
    
      default:
      return state;
  }
}

export default userReducer;
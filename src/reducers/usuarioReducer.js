const usuarioReducer = (state = [], action) => {
  switch (action.type) {

    case 'NOVO_USUARIO':
      return state.concat([action.usuario]);

    case 'DELETAR_USUARIO':
      return state.filter((usuario) => usuario.id !== action.id);

    case 'EDITAR_USUARIO':
      return state.map((usuario) => usuario.id === action.id ? { ...usuario, editing: !usuario.editing } : usuario);

    case 'ATUALIZAR_USUARIO':
      return state.map((usuario) => {
        if (usuario.id === action.id) {
          return {
            ...usuario,
            name: action.data.novoName,
            email: action.data.novoEmail,
            website: action.data.novoWebsite,
            editando: !usuario.editando
          }
        } else {
          return usuario;
        }
      });

    default:
      return state;
  }
}

export default usuarioReducer;
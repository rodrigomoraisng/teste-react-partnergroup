import React, { Component } from 'react';
import { connect } from 'react-redux';
import Usuario from './Usuario';
import EditaCampoUsuario from './EditaCampoUsuario';
import request from 'request';

class Usuarios extends Component {
  componentDidMount(){

    request('https://jsonplaceholder.typicode.com/users', (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let usuarios = null;

        try {
          usuarios = JSON.parse(body);
        } catch (e) {
          console.error(e);
        }

        if (usuarios !== null && Array.isArray(usuarios) && usuarios.length) {
          usuarios.map(usuario => {
            return this.props.dispatch({
              type: 'NOVO_USUARIO',
              usuario
            });
          });
        }
      }
    });
  }

  render() {
    return (
      <div className="usuarios-container">
        <h1 className="usuarios_titulo">Usuários</h1>
        <ul className="usuarios_tabela">
          {this.props.usuarios.map((usuario) => (
            <li key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10)}>{usuario.editing ? <EditaCampoUsuario usuario={usuario} key={usuario.id} /> : <Usuario usuario={usuario} key={usuario.id} />}</li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usuarios: state
  }
}

export default connect(mapStateToProps)(Usuarios);
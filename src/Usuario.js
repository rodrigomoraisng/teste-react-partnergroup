import React, { Component } from 'react';
import { connect } from 'react-redux';

class Usuario extends Component {
  render() {
    return (
      <div className="usuario">
        <h2 className="usuario_nome">{this.props.usuario.name}</h2>
        <p className="usuario_email">{this.props.usuario.email}</p>
        <p className="usuario_website">{this.props.usuario.website}</p>
        <div className="control-buttons">
          <button 
            className="usuario_acoes usuario_acoes-editar"
            onClick={() => this.props.dispatch({ type: 'EDITAR_USUARIO', id: this.props.usuario.id })}>
            Editar
          </button>
          <button 
            className="usuario_acoes usuario_acoes-deletar"
            onClick={() => this.props.dispatch({ type: 'DELETAR_USUARIO', id: this.props.usuario.id })}>
            Remover
          </button>
        </div>
      </div>
    );
  }
}

export default connect()(Usuario);
import React, { Component } from 'react';
import { connect } from 'react-redux';

class NovoUsuario extends Component {

  geraIDDoUsuario() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
  }

  adicionaNovoUsuario (e) {
    e.preventDefault();

    const name = this.getName.value;
    const email = this.getEmail.value;
    const website = this.getWebsite.value;

    const data = {
      id: this.geraIDDoUsuario(),
      name,
      email,
      website,
      editando: false
    };

    this.props.dispatch({
      type: 'NOVO_USUARIO',
      data
    });

    this.getName.value = '';
    this.getEmail.value = '';
    this.getWebsite.value = '';
  }

  render() {
    return (
      <div className="usuario-container">
        <h1 className="usuario_titulo">Novo Usuário</h1>
        <form className="form" onSubmit={this.adicionaNovoUsuario}>
          <input required type="text" ref={(input) => this.getName = input}
          placeholder="Nome" /><br /><br />
          <input required type="text" ref={(input) => this.getEmail = input}
          placeholder="Email" /><br /><br />
          <input required type="text" ref={(input) => this.getWebsite = input}
          placeholder="Website" /><br /><br />
          <button>Criar</button>
        </form>
      </div>
    );
  }
}

export default connect()(NovoUsuario);
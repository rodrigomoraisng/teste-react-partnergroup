import React, { Component } from 'react';
import { connect } from 'react-redux';

class EditaCampoUsuario extends Component {
  atualizaDadosDoUsuario = (e) => {
    e.preventDefault();
    
    const novoName = this.getName.value;
    const novoEmail = this.getEmail.value;
    const novoWebsite = this.getWebsite.value;

    const data = { novoName, novoEmail, novoWebsite };
    
    this.props.dispatch({ type: 'ATUALIZAR_USUARIO', id: this.props.post.id, data: data });
  }

  render() {
    return (
      <div key={this.props.usuarios.id} className="post">
        <form className="form" onSubmit={this.atualizaDadosDoUsuario}>
          <input required type="text" ref={(input) => this.getName = input}
          defaultValue={this.props.usuario.nome} placeholder="Enter Post Title" /><br /><br />

          <input required type="text" ref={(input) => this.getEmail = input}
          defaultValue={this.props.usuario.email} placeholder="Enter Post Title" /><br /><br />

          <input required type="text" ref={(input) => this.getWebsite = input}
          defaultValue={this.props.usuario.website} placeholder="Enter Post Title" /><br /><br />

          <button>Salvar alterações</button>
        </form>
      </div>
    );
  }
}

export default connect()(EditaCampoUsuario);
import React, { Component } from 'react';
import NovoUsuario from './NovoUsuario';
import ListagemUsuarios from './ListagemUsuarios';

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <div className="navbar">
          <h2 className="center">Post It</h2>
        </div>
        <NovoUsuario/>
        <ListagemUsuarios/>
      </div>
    );
  }
}

export default App;
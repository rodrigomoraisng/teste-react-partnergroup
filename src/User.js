import React, { Component } from 'react';
import { connect } from 'react-redux';
import DynamicForm from './DynamicForm';
import Util from './Util';
import { Link } from 'react-router-dom';
import request from 'request';

class User extends Component {
  _isMounted = false;

  constructor(props){
    super(props);
    
    this.state = {
      users: null,
      new: this.props.location.pathname.indexOf('novo') !== -1,
      user: null,
      hideLabels: false,
      isEditting: false,
      list: false
    };    
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {

    if (this.props.location !== prevProps.location) {
      this.setState({
        new: this.props.location.pathname.indexOf('novo') !== -1,
        users: null,
        user: null,
        hideLabels: false,
        list: false,
        isEditting: false
      });
      this._isMounted = false;
      this.reInit();
    }
  }

  init(){
    this._isMounted = true;
    const id = (('match' in this.props) && ('params' in this.props.match)) ? this.props.match.params.id : null;
    
    if (this._isMounted) {
      if (!id) {
        this.setState({ list: true });
      }
      if (this.props.location.pathname.indexOf('novo') !== -1) {
        this.setState({ new: true });
      } else {
        Util.get(id ? id : null, data => {
          data = Util.parseJSONString(data);
          if (Array.isArray(data)) {
            this.setState({ hideLabels: true, users: data });
          } else {
            this.setState({ user: data });
          }
        });
      }
    }
  }

  reInit(){
    return this.init();
  }

  componentDidMount(){
    this.init();
  }

  render() {
    const user = this.state.user;
    const users = this.state.users;
    const items = Util.getFormObj('user').filter(item => this.state.new || !this.state.list || (this.state.list && !item.disableFromList));
    
    if (this.state.new) {
      return(
        <div className="usuario">
          <DynamicForm
            new={true} 
            items={items}
            hideLabels={false} 
            iterator={user}
            list={false}
          />
        </div>
      );
    } else if (users !== null) {
      if (users.length) {
        return (
          <div className="users-container">
            <img src={require('./assets/img/logo.png')} alt="logo" />
            <h1 className="users_title">Listagem de Usuários</h1>
            <ul className="users_table">
              {users.map((user) => (
                <li key={Util.buildToken()}>
                  <DynamicForm 
                    items={items}
                    hideLabels={this.state.hideLabels} 
                    iterator={user}
                    list={this.state.list} 
                  />
                </li>
              ))}
            </ul>
            <Link to="/usuarios/novo">Novo</Link>
          </div>
        );
      } else {
        return (<div>Nenhum usuário encontrado</div>);
      }
    } else if (user !== null) {
      if (this.state.isEditting) {
        return(
          <div className="usuario">
            <DynamicForm 
              items={items}
              hideLabels={this.state.hideLabels} 
              iterator={user}
              list={this.state.list}
              isEditting={this.state.isEditting}
            />
          </div>
        );
      }
      return(
        <div className="usuario">
          <DynamicForm
            items={items}
            hideLabels={this.state.hideLabels} 
            iterator={user}
            list={this.state.list}
            isEditting={this.state.isEditting} 
          />
          <div className="control-buttons">
            <button 
              className="usuario_acoes usuario_acoes-editar"
              onClick={() => { this.setState({ isEditting: !this.state.isEditting })}}>
              {this.state.isEditting ? 'Cancelar' : 'Editar'}
            </button>
            <button 
              className="usuario_acoes usuario_acoes-deletar" 
              onClick={() => {}}>
              Remover
            </button>
          </div>
        </div>
      );
    } else {
      return(<div>Carregando</div>);
    }
  }
}

export default connect()(User);
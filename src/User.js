import React, { Component } from 'react';
import { connect } from 'react-redux';
import DynamicForm from './DynamicForm';
import Util from './Util';
import { Link, Redirect } from 'react-router-dom';

class User extends Component {
  _isMounted = false;

  constructor(props){
    super(props);
    const currentRoute = this.props.location ? this.props.location.pathname : window.location.pathname;
    this.state = {
      users: null,
      loaded: false,
      redirectPath: '',
      new: currentRoute === '/usuarios/novo',
      user: null,
      id: null,
      hideLabels: false,
      redirect: false,
      isEditting: currentRoute.indexOf('/usuarios/editar') !== -1,
      list: false
    };    
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    const currentRoute = this.props.location ? this.props.location.pathname : window.location.pathname;
    if (this.props.location !== prevProps.location) {
      this.setState({
        new: currentRoute === '/usuarios/novo',
        users: null,
        redirectPath: '',
        loaded: false,
        id: null,
        user: null,
        redirect: false,
        hideLabels: false,
        list: false,
        isEditting: currentRoute.indexOf('/usuarios/editar') !== -1
      });
      this._isMounted = false;
      this.reInit();
    }
  }

  init(){
    this._isMounted = true;
    const id = (('match' in this.props) && ('params' in this.props.match)) ? this.props.match.params.id : null;
    const currentRoute = this.props.location.pathname;
    
    if (this._isMounted) {      
      if (currentRoute === '/usuarios/novo') {
        this.setState({ new: true, loaded: true});
      } else {
        Util.get(id ? id : null, users => {

          users = Util.parseJSONString(users);

          if (['/usuarios', '/usuarios/'].indexOf(currentRoute) !== -1) {
            this.setState({ 
              list: true, 
              hideLabels: true, 
            });
          }
          if (['/usuarios/editar/' + id, '/usuarios/editar/' + id + '/'].indexOf(currentRoute) !== -1) {
            this.setState({ id })
          }
              
          if (['/usuarios/' + id, '/usuarios/' + id + '/'].indexOf(currentRoute) !== -1) {
            this.setState({ id });
          }

          this.props.dispatch({type: 'ADD', users});
          this.setState({loaded: true});
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

  setRedirect (path) {
    this.setState({
      redirectPath: path,
      redirect: true,
    });
  }

  renderRedirect(){
    if (this.state.redirect && this.props.location.pathname !== this.state.redirectPath) {
      return (<Redirect to={this.state.redirectPath} />);
    }
  }

  remove(id){
    Util.remove(id, () => {
      this.setRedirect('/usuarios');
      this.props.dispatch({type: 'DELETE', id});
    })
  }

  render() {
    if (!this.state.loaded) {
      return (<div>Carregando aplicação</div>);
    }
    const users = this.props.users;
    const items = Util.getFormObj('user').filter(item => this.state.new || !this.state.list || (this.state.list && !item.disableFromList));

    if (this.state.new) {
      return(
        <div className="usuario">
          <DynamicForm
            new={true} 
            items={items}
            hideLabels={false}
            list={false}
          />
        </div>
      );
    } else if (users && users.length) {
      if (this.state.id) {
        let user = {};
        users.map(userObj => {
          if(userObj.id.toString() === this.state.id.toString()){
            user = userObj
          }
        });

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
            <Link to="/usuarios">usuarios</Link>
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
                onClick={() => {
                  this.setRedirect('/usuarios/editar/' + user.id)
                }}>
                {this.state.isEditting ? 'Cancelar' : 'Editar'}
              </button>
              
              <button 
                className="usuario_acoes usuario_acoes-deletar" 
                onClick={() => { this.remove(user.id) }}>
                Remover {this.state.redirectPath}
              </button>
              
              {this.renderRedirect()}
            </div>
          </div>
        );
      }
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
          
          {this.renderRedirect()}
        </div>
      );
    } else {
      return(<div>Carregando</div>);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    users: state
  }
};

export default connect(mapStateToProps)(User);
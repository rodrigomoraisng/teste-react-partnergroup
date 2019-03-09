import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Util from './Util';
import { connect } from 'react-redux';

class DynamicForm extends Component {
  _isMounted = false;

  constructor(props){
    super(props);
    this.state = {
      redirectPath: '',
      redirect: false
    };
  }

  sendFormData = (e) => {
    e.preventDefault();
    let dataObj = {};
    this.props.items.map(item => {
      if (item.items) {
        item.items.map(subItem => {
          if (subItem.items) {
            subItem.items.map(sItem => {
              dataObj[item.id][subItem.id] = dataObj[item.id][subItem.id] || {};
              dataObj[item.id][subItem.id][sItem.id] = this[item.id][subItem.id][sItem.id].value;
            });
          } else {
            dataObj[item.id] = dataObj[item.id] || {};
            dataObj[item.id][subItem.id] = this[item.id][subItem.id].value;     
          }
        })
      } else {
        dataObj[item.id] = this[item.id].value;
      }
    });

    if (this.formAction === 'update') {
      Util.update(this.props.iterator.id, dataObj, () => {
        dataObj.id = this.props.iterator.id;
        this.props.dispatch({type: 'UPDATE', users: dataObj});
        this.setRedirect('/usuarios/' + this.props.iterator.id);
      });
    } else if (this.formAction === 'add') {
      Util.add(dataObj, () => {
        dataObj.id = Util.buildToken();
        dataObj.new = true;
        this.props.dispatch({type: 'NEW', users: dataObj});
        this.setRedirect('/usuarios');
      });
    }
  }

  setRedirect(path){
    this.setState({
      redirectPath: path,
      redirect: true
    });
  }

  renderRedirect(){
    if (this.state.redirect && window.location.pathname !== this.state.redirectPath) {
      return (<Redirect to={this.state.redirectPath} />);
    }
  }
  
  render () {
    if (this.props.isEditting || this.props.new) {
      return (
        <form className="form" onSubmit={this.sendFormData}>
          {this.props.items.map(item => (
            <div key={Util.buildToken()}>
              {item.items ? 
                <div className={'formfield_itemWithSubItems formfield_' + item.id}>
                  <div className={'formfield_itemWithSubItems_value'}>{item.id}</div>
                  {item.items.map(subItem => (
                    <div key={Util.buildToken()}>
                      {subItem.items ? 
                        <div className={'formfield_subItemWithItems formfield_' + subItem.id}>
                          <div className={'formfield_subItemWithItems_value'}>{subItem.id}</div>
                          {subItem.items.map(sItem => (
                            <div key={Util.buildToken()}>
                              {sItem.required ? 
                                <input 
                                  required 
                                  type="text" 
                                  name={item.id + '_' +  subItem.id + '_' + sItem.id}
                                  ref={(input) => {
                                    this[item.id] = this[item.id] || {};
                                    this[item.id][subItem.id] = this[item.id][subItem.id] || {};
                                    this[item.id][subItem.id][sItem.id] = input;
                                  }}
                                  placeholder={sItem.id}
                                  defaultValue={this.props.new ? '' : this.props.iterator[item.id][subItem.id][sItem.id]}
                                />
                              :
                                <input  
                                  type="text"
                                  name={item.id + '_' +  subItem.id + '_' + sItem.id}
                                  ref={(input) => {
                                    this[item.id] = this[item.id] || {};
                                    this[item.id][subItem.id] = this[item.id][subItem.id] || {};
                                    this[item.id][subItem.id][sItem.id] = input;
                                  }}
                                  placeholder={sItem.id}
                                  defaultValue={this.props.new ? '' : this.props.iterator[item.id][subItem.id][sItem.id]}
                                />
                              }
                            </div>    
                          ))}
                        </div>
                      : 
                        <div>
                          {subItem.required ? 
                            <input 
                              required 
                              type="text" 
                              name={item.id + '_' +  subItem.id}
                              ref={(input) => {
                                this[item.id] = this[item.id] || {};
                                this[item.id][subItem.id] = input;
                              }}
                              placeholder={subItem.id}
                              defaultValue={this.props.new ? '' : this.props.iterator[item.id][subItem.id]}
                            />
                          :
                            <input  
                              type="text"
                              name={item.id + '_' +  subItem.id}
                              ref={(input) => {
                                this[item.id] = this[item.id] || {};
                                this[item.id][subItem.id] = input;
                              }}
                              placeholder={subItem.id}
                              defaultValue={this.props.new ? '' : this.props.iterator[item.id][subItem.id]}
                            />
                          }
                        </div>
                      }
                    </div>
                  ))}
                </div>
              : 
                <div>
                  {item.required ? 
                    <input 
                      required 
                      type="text" 
                      name={item.id}
                      ref={(input) => this[item.id] = input}
                      placeholder={item.id}
                      defaultValue={this.props.new ? '' : this.props.iterator[item.id]}
                    />
                  :
                    <input  
                      type="text"
                      name={item.id}
                      ref={(input) => this[item.id] = input}
                      placeholder={item.id}
                      defaultValue={this.props.new ? '' : this.props.iterator[item.id]}
                    />
                  }
                </div>
              }
            </div>
          ))}
          <input type="hidden" name="formAction" ref={(input) => this.formAction = this.props.new ? 'add' : 'update'}/>
          <button>{this.props.new ? 'Criar' : 'Salvar alterações'}</button>
          {this.renderRedirect()}
        </form>
      )
    } else {
      return (
        <div>
          {this.props.items.map(item => (
            <BuildFormfield
              key={Util.buildToken()}
              item={item}
              hideLabels={this.props.hideLabels}
              iterator={this.props.iterator}
              list={this.props.list}
              isEditting={this.props.isEditting}
            />
          ))}
        </div>
      );
    }
  }
}

class BuildFormfield extends Component {
  render() {
    const item = this.props.item;
    const hideLabels = this.props.hideLabels;
    const iterator = this.props.iterator;
    
    if (item.id && Array.isArray(item.items) && item.items.length) {
      return (
        <div className={'formfield_itemWithSubItems formfield_' + item.id}>
          <div className={'formfield_itemWithSubItems_value'}>{item.id}</div>
          {item.items.map(subItem => (
            <BuildFormfield
              key={Util.buildToken()}
              item={subItem}
              hideLabels={hideLabels}
              list={this.props.list}
              isEditting={this.props.isEditting}
              iterator={iterator[item.id]}
            />
          ))}
        </div>
      );
    }

    return (
      <DisplayFormfieldValue
        renderLink={!this.props.disableLink && item.link}
        iterator={iterator}
        item={item}
        list={this.props.list}
        hideLabels={hideLabels}
      />
    );
  }
}

class DisplayFormfieldValue extends Component {
  render() {
    const item = this.props.item;
    const iterator = this.props.iterator;
    const label = this.props.hideLabels ? '' : item.id + ': ';

    return (
      <div className={'formfield_value formfield_' + item.id}>
        {label}{this.props.list && this.props.renderLink ? 
          <Link to={'/usuarios/' + iterator.id}>{iterator[item.id]}</Link> 
        : iterator[item.id]}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state
  }
};

export default connect()(DynamicForm);
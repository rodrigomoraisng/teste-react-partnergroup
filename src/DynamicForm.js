import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Util from './Util';
import { connect } from 'react-redux';

class DynamicForm extends Component {
  constructor(props){
    super(props);
    this.state = {action: null}
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

    if (this.state.action === 'update') {
      Util.update(this.props.iterator.id, dataObj);
    } else if (this.state.action === 'add'){
      Util.add(this.props.iterator.id, dataObj);
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
                                  onChange={this.handleInputChange}
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
                                  onChange={this.handleInputChange}
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
                              onChange={this.handleInputChange}
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
                              onChange={this.handleInputChange}
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
                      onChange={this.handleInputChange}
                      ref={(input) => this[item.id] = input}
                      placeholder={item.id}
                      defaultValue={this.props.new ? '' : this.props.iterator[item.id]}
                    />
                  :
                    <input  
                      type="text"
                      name={item.id}
                      onChange={this.handleInputChange}
                      ref={(input) => this[item.id] = input}
                      placeholder={item.id}
                      defaultValue={this.props.new ? '' : this.props.iterator[item.id]}
                    />
                  }
                </div>
              }
            </div>
          ))}
          <button>Salvar alterações</button>
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
        {label}{this.props.renderLink ? 
          <Link to={'/usuarios/' + iterator.id}>{iterator[item.id]}</Link> 
        : iterator[item.id]}
      </div>
    );
  }
}

export default connect()(DynamicForm);
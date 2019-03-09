import request from 'request';

export default {

  wsURL: 'https://jsonplaceholder.typicode.com/users/',

  remove(id, callback) {
    if (typeof id === 'undefined') return;
    return this.req({
      type: 'DELETE',
      url: this.wsURL + id, callback
    });
  },

  get(id, callback) {
    return this.req({
      type: 'GET',
      url: this.wsURL + (id !== null ? id : ''), callback
    });
  },

  add(data, callback) {
    if (!data) return;
    return this.req({
      type: 'POST',
      url: this.wsURL, callback, data
    });
  },

  update(id, data, callback){
    if (!id || !data) return;
    return this.req({
      type: 'PUT',
      url: this.wsURL + (id !== null ? id : ''), callback, data
    });
  },
  
  stringCapitalize (str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  },

  getFormObj (id) {
    const items = require('./forms/' + id + '.json');
    return items;
  },

  buildToken () {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
  },

  req (options) {
    const o = options;
    return request({
      method: o.type, url: o.url, json: o.data 
    }, (err, res, data) => {
      if (err) return console.error(err);
      if (res.statusCode === 200 && data) {
        return typeof o.callback === 'function' ? o.callback(data) : data;
      }
      return typeof o.callback === 'function' ? o.callback(null) : null;
    });
  },

  parseJSONString(str) {
    try {
      str = JSON.parse(str);
    } catch (e) {
      str = null;
    }
    return str;
  }
}
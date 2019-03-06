import request from 'request';

export default {

  wsURL: 'https://jsonplaceholder.typicode.com/users/',

  remove(id, callback) {
    if (typeof id === 'undefined') return;
    return this.req({
      type: 'delete',
      url: this.wsURL + id, callback
    });
  },

  get(id, callback) {
    return this.req({
      url: this.wsURL + (id !== null ? id : ''), callback
    });
  },

  add(data, callback) {
    if (!data) return;
    return this.req({
      type: 'post',
      url: this.wsURL, callback,
    });
  },

  update(id, data, callback){
    if (!id || !data) return;
    return this.req({
      type: 'put',
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
    
    return request[o.type || 'get'](o.url, (err, res, data) => {
      if (err) return console.error(err);
      if (res.statusCode === 200 && data) {
        return o.callback(data);
      }
      return null;
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
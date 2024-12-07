const config = require('../config/config.js');

module.exports = {
  request: function(url, data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${url}?key=${config.APIKEY}&location=${data.location}`,
        success: res => resolve(res.data),
        fail: err => reject(err)
      });
    });
  }
};
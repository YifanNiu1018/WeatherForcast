// app.js
App({
  globalData: {
    APIKEY:'23aaeba5c9e849b396abc17bd746eaac',
    locationId: '', 
    latitude: '',   
    longitude: '',
    locationInfo: ''   
  },

  onLaunch: function() {
    this.initLocation();
  },

  initLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.globalData.latitude = res.latitude;
        that.globalData.longitude = res.longitude;
        that.getLocationId(res.latitude, res.longitude);
      },
      fail: function() {
        wx.showToast({
          title: '需要位置权限',
          icon: 'none'
        });
      }
    });
  },

  getLocationId: function(latitude, longitude) {
    var that = this;
    wx.request({
        url: 'https://devapi.qweather.com/v7/weather/24h?key=' + that.globalData.APIKEY + "&location=" + latitude + ',' + longitude,
        success: function(res) {
            console.log(res.data);
            if (res.data.code === '200' && res.data.location && res.data.location[0]) {
                that.globalData.locationId = res.data.location[0].id;
                that.globalData.locationInfo = res.data.location[0];
                if (that.locationReadyCallback) {
                    that.locationReadyCallback(res.data.location[0].id);
                }
            }
        },
        fail: function(info){
            wx.showModal({title: info.errMsg});
        }
    });
},

  getLocation: function(callback) {
    if (this.globalData.locationId) {
      callback(this.globalData.locationId);
    } else {
      this.locationReadyCallback = callback;
    }
  }
});
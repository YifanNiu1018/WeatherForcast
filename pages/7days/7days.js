Page({
  data: {
    daily: []
  },

  onLoad: function() {
    const daily = wx.getStorageSync('daily');
    if (daily) {
      this.setData({
        daily: daily
      });
    }
  }

})
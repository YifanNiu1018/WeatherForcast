Page({
  data: {
    detail: []
  },

  onLoad: function() {
    const detail = wx.getStorageSync('detail');
    if (detail) {
      this.setData({
        detail: detail
      });
    }
  }

})
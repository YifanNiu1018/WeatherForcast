Page({
  data: {
    detail: []
  },

  onLoad: function() {
    const detail = wx.getStorageSync('detail');
    console.log(detail)
    if (detail) {
      this.setData({
        detail: detail
      });
    }
  }

})
Page({
  data: {
    cities: [
      { name: '北京', weather: '10' },
      { name: '上海', weather: '20' },
      { name: '广州', weather: '30' }
    ],
    searchQuery: '' // 用户输入城市
  },

  // 监听搜索框输入
  onSearchInput: function (event) {
    this.setData({
      searchQuery: event.detail.value
    });
  },

  // 处理点击搜索按钮
  onSearchClick: function () {
    //TODO: 
    //根据用户输入城市，调用api，获取城市温度，添加到cities列表
    const query = this.data.searchQuery; //用户输入城市

  },

  // 处理按下回车键（换行）
  onSearchConfirm: function () {
    this.onSearchClick();
  },

  // 删除城市
  onDeleteCity: function (event) {
    const cityName = event.currentTarget.dataset.city;
    const newCities = this.data.cities.filter(item => item.name !== cityName);
    this.setData({
      cities: newCities
    });
  }
});

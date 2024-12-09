const config = require('../../config/config.js');
const utils = require('../../utils/utils.js');
const weatherApi = require('../../api/api.js');
const MAX_CITIES = 10; // 最大城市数限制

Page({
  data: {
    cities: [],
    searchQuery: '',
    isLoading: false,
  },

  navigateToDetail: function (event) {
    const item = event.currentTarget.dataset.item;
    wx.setStorageSync('detail', item);
    wx.navigateTo({
      url: '/pages/detail/detail'
    });
  },

  onLoad() {
    this.loadStoredCities();
  },

  // 加载存储的城市列表
  loadStoredCities() {
    try {
      const storedCities = wx.getStorageSync('savedCities') || [];
      this.setData({
        cities: storedCities
      });
      this.refreshAllCitiesWeather();
    } catch (err) {
      console.error('加载存储城市失败:', err);
    }
  },

  // 刷新所有城市天气
  async refreshAllCitiesWeather() {
    const updatedCities = await Promise.all(
      this.data.cities.map(async city => {
        try {
          const weatherData = await weatherApi.getNowWeather(city.name);
          return {
            ...city,
            now: weatherData.now,
            updateTime: new Date().toISOString()
          };
        } catch (err) {
          console.error(`更新${city.name}天气失败:`, err);
          return city;
        }
      })
    );

    this.updateCitiesList(updatedCities);
  },

  
    

  // 监听搜索框输入
  onSearchInput(event) {
    this.setData({
      searchQuery: event.detail.value.trim()
    });
  },

  // 处理搜索
  async onSearchClick() {
    if (this.data.isLoading) return;

    const queryCity = this.data.searchQuery;

    if (!this.validateSearch(queryCity)) return;

    this.setData({
      isLoading: true
    });
    wx.showLoading({
      title: '加载中'
    });

    try {
      const weatherData = await weatherApi.getNowWeather(queryCity);
      const newCity = {
        name: queryCity,
        now: weatherData.now,
        updateTime: new Date().toISOString()
      };

      this.addCity(newCity);
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1500
      });
    } catch (err) {
      // 处理具体错误信息
      this.handleError('获取天气数据失败,请输入正确的城市名');
    } finally {
      this.setData({
        isLoading: false,
        searchQuery: ''
      });
      wx.hideLoading();
    }
  },

  // 验证搜索输入
  validateSearch(city) {
    if (!city) {
      this.handleError('请输入城市名');
      return false;
    }

    if (this.data.cities.length >= MAX_CITIES) {
      this.handleError(`最多只能添加${MAX_CITIES}个城市`);
      return false;
    }

    if (this.data.cities.some(item => item.name === city)) {
      this.handleError('该城市已添加');
      return false;
    }

    return true;
  },

  // 添加城市
  addCity(newCity) {
    const newCities = [newCity, ...this.data.cities];
    this.updateCitiesList(newCities);
  },

  // 更新城市列表
  updateCitiesList(cities) {
    this.setData({
      cities
    });
    this.saveCitiesToStorage(cities);
  },

  // 保存城市列表到本地存储
  saveCitiesToStorage(cities) {
    try {
      wx.setStorageSync('savedCities', cities);
    } catch (err) {
      console.error('保存城市列表失败:', err);
    }
  },

  // 删除城市
async onDeleteCity(event) {
  const cityName = event.currentTarget.dataset.city;
  
  // 显示确认弹窗
  const res = await wx.showModal({
    title: '确认删除',
    content: `是否要删除城市"${cityName}"？`,
    confirmText: '删除',
    confirmColor: '#FF0000',
    cancelText: '取消'
  });

  // 用户点击确认后执行删除
  if (res.confirm) {
    const newCities = this.data.cities.filter(item => item.name !== cityName);
    this.updateCitiesList(newCities);
    
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1500
    });
  }
},

  // 处理回车搜索
  onSearchConfirm() {
    this.onSearchClick();
  },

  // 统一错误处理
  handleError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.refreshAllCitiesWeather();
    wx.stopPullDownRefresh();
  }
});
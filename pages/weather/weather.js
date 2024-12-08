const config = require('../../config/config.js');
const utils = require('../../utils/utils.js');
const weatherApi = require('../../api/api.js');

Page({
  data: {
    location: '',
    City: '',
    County: '',
    now: null,
    hourly: [],
    daily: [],
    time: ''
  },

  navigateTo7Days: function() {
    wx.setStorageSync('daily', this.data.daily);
    wx.navigateTo({
      url: '/pages/7days/7days'
    });
  },

  onLoad() {
    this.getLocation();
  },

  async selectLocation() {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.chooseLocation({
          success: resolve,
          fail: reject
        });
      });
      
      this.setData({
        location: `${res.longitude},${res.latitude}`
      });
      
      await Promise.all([
        this.getWeather(),
        this.getCityByLocation()
      ]);
    } catch (err) {
      this.handleLocationError();
    }
  },

  async getLocation() {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.getLocation({
          type: 'gcj02',
          success: resolve,
          fail: reject
        });
      });
      
      this.setData({
        location: `${res.longitude},${res.latitude}`
      });
      
      await Promise.all([
        this.getWeather(),
        this.getCityByLocation()
      ]);
    } catch (err) {
      this.handleLocationError();
    }
  },

  async getCityByLocation() {
    try {
      const res = await weatherApi.request(
        `${config.BASE_URL.GEO}/city/lookup`,
        { location: this.data.location }
      );
      
      if (res.code === '200') {
        const data = res.location[0];
        this.setData({
          City: data.adm2,
          County: data.name
        });
      } else {
        throw new Error('获取城市信息失败');
      }
    } catch (err) {
      wx.showToast({
        title: err.message || '获取城市信息失败',
        icon: 'none'
      });
    }
  },

  async getWeather() {
    wx.showLoading({ title: '加载中' });
    
    try {
      const [nowRes, hourlyRes, dailyRes] = await Promise.all([
        weatherApi.request(`${config.BASE_URL.WEATHER}/weather/now`, 
          { location: this.data.location }),
        weatherApi.request(`${config.BASE_URL.WEATHER}/weather/24h`, 
          { location: this.data.location }),
        weatherApi.request(`${config.BASE_URL.WEATHER}/weather/7d`, 
          { location: this.data.location })
      ]);

      const hourly = hourlyRes.hourly.map(item => ({
        ...item,
        time: utils.formatObsTime(item.fxTime)
      }));

      const daily = dailyRes.daily.map(item => ({
        ...item,
        date: utils.formatTime(new Date(item.fxDate)).daily,
        dateToString: utils.formatTime(new Date(item.fxDate)).dailyToString
      }));

      const time = utils.formatObsTime(nowRes.now.obsTime)

      this.setData({
        now: nowRes.now,
        hourly,
        daily,
        time
      });

      
      
    } catch (err) {
      wx.showToast({
        title: '获取天气信息失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  async handleLocationError() {
    const res = await wx.showModal({
      title: '获取位置信息失败',
      content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】'
    });

    if (res.confirm) {
      try {
        const settingRes = await wx.openSetting();
        if (settingRes.authSetting['scope.userLocation']) {
          await this.getLocation();
        } else {
          this.setDefaultLocation();
        }
      } catch (err) {
        this.setDefaultLocation();
      }
    } else {
      this.setDefaultLocation();
    }
  },

  setDefaultLocation() {
    this.setData({ location: '地理位置' });
    this.getWeather();
    this.getCityByLocation();
  }
});
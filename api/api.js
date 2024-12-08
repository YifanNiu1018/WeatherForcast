const config = require('../config/config.js');  
const utils = require('../utils/utils.js');


module.exports = {
  request: function(url, data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${url}?key=${config.APIKEY}&location=${data.location}`,
        success: res => resolve(res.data),
        fail: err => reject(err)
      });
    });
  },
  getCityLocation: async function(cityName) {
    const res = await this.request(
      `${config.BASE_URL.GEO}/city/lookup`,
      { location: cityName }
    );
    
    if (!res.location || res.location.length === 0) {
      throw new Error('未找到该城市');
    }
    
    const cityInfo = res.location[0];
    return `${cityInfo.lon},${cityInfo.lat}`;
  },
  getNowWeather: async function(location) {
    try {
      if (!this.isLatLonFormat(location)) {
        location = await this.getCityLocation(location);
      }
      console.log(location)
      const res = await this.request(
        `${config.BASE_URL.WEATHER}/weather/now`, 
        { location }
      );

      return {
        now: res.now,
        time: utils.formatObsTime(res.now.obsTime)
      };
    } catch (err) {
      throw new Error(`获取天气数据失败: ${err.message}`);
    }
  },

  // 验证是否为经纬度格式
  isLatLonFormat: function(location) {
    // 经纬度格式: "116.41,39.92"
    const pattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    return pattern.test(location);
  },

  // 获取24小时天气
  get24hWeather: async function(location) {
    const res = await this.request(
      `${config.BASE_URL.WEATHER}/weather/24h`, 
      { location }
    );
    return {
      hourly: utils.formatHourlyData(res.hourly)
    };
  },

  // 获取7天天气
  get7dWeather: async function(location) {
    const res = await this.request(
      `${config.BASE_URL.WEATHER}/weather/7d`, 
      { location }
    );
    return {
      daily: utils.formatDailyData(res.daily)
    };
  },
};
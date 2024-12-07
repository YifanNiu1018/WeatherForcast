module.exports = {
  formatTime: function(date) {
    const weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
    
    const formatNumber = n => n < 10 ? `0${n}` : n;
    
    return {
      hourly: `${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}`,
      daily: `${formatNumber(date.getMonth() + 1)}-${formatNumber(date.getDate())}`,
      dailyToString: isToday ? "今天" : weekArray[date.getDay()]
    };
  }
};

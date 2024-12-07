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
  },
  
  formatObsTime: function(obsTime) {
    if (!obsTime) return '';
    
    try {
      const date = new Date(obsTime);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}年${month}月${day}日 ${hour}:${minute}`;
    } catch (error) {
      console.error('时间格式化错误:', error);
      return obsTime;
    }
  }
};
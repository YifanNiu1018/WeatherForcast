// pages/listedcity/listedcity.js
Page({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        weatherData:[
            {city:'南京市鼓楼区',temperature:16,backgroundColor:''},
            {city:'南京市鼓楼区',temperature:15,backgroundColor:''},
            {city:'南京市鼓楼区',temperature:14,backgroundColor:''},
            {city:'南京市鼓楼区',temperature:13,backgroundColor:''},
            {city:'南京市鼓楼区',temperature:12,backgroundColor:''},
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

    },
    onLoad: function() {
        this.setRandomBackgroundColors();
      },
    setRandomBackgroundColors: function() {
        const updatedWeatherData = this.data.weatherData.map(item => {
          return {
            ...item,  // 保留原有的数据
            backgroundColor: this.randomColor()  // 为每个item生成一个随机背景颜色
          };
        });
        this.setData({
          weatherData: updatedWeatherData  // 更新weatherData数据
        });
    },
    
    randomColor: function() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        // 设定透明度为 0.5
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    }
})
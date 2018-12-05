//index.js
//获取应用实例
const app = getApp()
var tcity = require("../../utils/city.js");

Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    // 联动选择器
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    product:[],
    joinImage:"",
    joinProcess:"",
    menu:[],
    phoneImage:"",
    imgbottom: "",
    clear:'',
    imgnum:2
  },
  formSubmit:function(e){
    console.log(e,"表单数据")
    var that = this
    if (e.detail.value.name == ''){
      wx.showModal({
        title: '姓名不能为空',
        content: '',
      })
      return;
    } else if (e.detail.value.phone == ''){
      wx.showModal({
        title: '手机号不能为空',
        content: '',
      })
      return;
    } else if (e.detail.value.detailedAddress == '') {
      wx.showModal({
        title: '详细地址不能为空',
        content: '',
      })
      return;
    } else if (that.data.province == '请选择省') {
      wx.showModal({
        title: '请选择省份',
        content: '',
      })
      return;
    } else if (that.data.city == '请选择市') {
      wx.showModal({
        title: '请选择城市',
        content: '',
      })
      return;
    } else if (that.data.county == '请选择区') {
      wx.showModal({
        title: '请选择县区',
        content: '',
      })
      return;
    }
    wx.request({
      url: app.globalData.url + "/api/joinInformation",
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data:{
        name: e.detail.value.name,
        phone: e.detail.value.phone,
        detailedAddress: e.detail.value.detailedAddress,
        province: that.data.province,
        city: that.data.city,
        district:that.data.county
      },
      success:function(res){
        if (res.data.errrorcode==0){
          wx.showModal({
            title: '提交成功！',
            content: '',
          })
          that.setData({
            clear:''
          })
        }else{
          wx.showModal({
            title: '提交失败！',
            content: '',
          })
        }
        
      },
      fail:function(){
        wx.showModal({
          title: '提交失败！',
          content: '',
        })
      }
    })
    console.log(e, "表单数据", this.data.city)
  },
  goTo:function(e){
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../article/article?id=' + id,
    })
  },
  //幻灯片 
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

//联动选择器
  bindChange: function (e) {
    console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  showView:function(){
     this.setData({
       condition: true
     })
  },
  getSlide:function(){
    var that = this
    wx.request({
      url: app.globalData.url + "/api/allSlide",
      success:function(res){
        //console.log(res.data,"+++++++")
        var result = res.data
        for (var i = 0; i < result.length; i++) {
          result[i].url = app.globalData.url + "/getImage/" + result[i].url
        }
        that.setData({
          imgUrls: result
        })
        console.log(that.data.imgUrls,"幻灯片")
      }
    })
  },
  ccityInit:function(){
    var that = this
    tcity.init(this);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log(provinces)
    console.log('初始化完成');
  },
  getProduct:function(){
    var that = this
    wx.request({
      url: app.globalData.url + "/api/allProduct",
      success:function(res){
        var result = res.data
        for (var i = 0; i < result.length; i++) {
          result[i].url = app.globalData.url + "/getImage/" + result[i].url
        }
        that.setData({
          product: result
        })

        console.log(result,"产品")
      }
    })
  },
  getIndexImage:function(){
    var that = this
    wx.request({
      url: app.globalData.url + "/api/allImage",
      success:function(res){
        
        var result = res.data
        for (var i = 0; i < result.length; i++) {
          result[i].url = app.globalData.url + "/getImage/" + result[i].url
        }
        console.log(result, "首页图片")
        var joinImage, joinProcess, phoneImage, imgbottom
        for(var i = 0;i<result.length;i++){
          if(result[i].name == "招商加盟"){
            joinImage = result[i].url
          } else if (result[i].name == "加盟流程"){
            joinProcess = result[i].url
          } else if (result[i].name == "联系方式top") {
            phoneImage = result[i].url
          } else if (result[i].name == "联系方式bottom"){
            imgbottom = result[i].url
          }
        }
        //console.log(joinImage,joinProcess)
        that.setData({
          joinImage: joinImage,
          joinProcess: joinProcess,
          phoneImage: phoneImage,
          imgbottom: imgbottom
        })
      }
    })
  },
  getMenu:function(){
    var that = this
    wx.request({
      url: app.globalData.url + "/api/allPage",
      success:function(res){
        console.log(res.data,"菜单")
        var result = res.data
        for (var i = 0; i < result.length; i++) {
          result[i].icon = app.globalData.url + "/getImage/" + result[i].icon
        }
        that.setData({
          menu:result
        })
      }
    })
  },
  callMe:function(){
    wx.makePhoneCall({
      phoneNumber: '13153387654',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function () {
    console.log("onLoad");
    var that = this;
    this.ccityInit()
    

    this.getSlide()
    this.getProduct()
    this.getIndexImage()
    this.getMenu()
  }
})

const http = require('superagent');
const consoleColors = require('./console-colors');
const sound = require('sound-play');
const schedule = require('node-schedule');

/**
 * 型号 : 地址
 * @type {{'MQ203CH/A': string, 'MPUJ3CH/A': string}}
 */
const models = {
  // 'MQ203CH/A': '河南 郑州 二七区',
  // 'MPUJ3CH/A': '河南 郑州 二七区',

  // -----iPhone 15 Pro -----

  // // iPhone 15 Pro 128GB
  // 'MTQ63CH/A': '原色钛金属',
  // 'MTQ73CH/A': '蓝色钛金属',
  // 'MTQ53CH/A': '白色钛金属',
  // 'MTQ43CH/A': '黑色钛金属',

  // // iPhone 15 Pro 256GB
  // 'MTQA3CH/A': '原色钛金属',
  // 'MTQC3CH/A': '蓝色钛金属',
  // 'MTQ93CH/A': '白色钛金属',
  // 'MTQ83CH/A': '黑色钛金属',
  
  // // iPhone 15 Pro 512GB
  // 'MTQF3CH/A': '原色钛金属',
  // 'MTQG3CH/A': '蓝色钛金属',
  // 'MTQE3CH/A': '白色钛金属',
  // 'MTQD3CH/A': '黑色钛金属',
  
  // // iPhone 15 Pro 1TB
  // 'MTQK3CH/A': '原色钛金属',
  // 'MTQL3CH/A': '蓝色钛金属',
  // 'MTQJ3CH/A': '白色钛金属',
  // 'MTQH3CH/A': '黑色钛金属',

  // -----iPhone 15 Pro Max-----

  // iPhone 15 Pro Max 256GB 
  'MU2Q3CH/A': '原色钛金属',
  'MU2R3CH/A': '蓝色钛金属',
  'MU2P3CH/A': '白色钛金属',
  // 'MU2N3CH/A': '黑色钛金属',

  // // iPhone 15 Pro Max 512GB
  // 'MU2V3CH/A': '原色钛金属',
  'MU2W3CH/A': '蓝色钛金属',
  // 'MU2U3CH/A': '白色钛金属',
  // 'MU2T3CH/A': '黑色钛金属',
  // // iPhone 15 Pro Max 1TB
  // 'MU603CH/A': '原色钛金属',
  // 'MU613CH/A': '蓝色钛金属',
  // 'MU2Y3CH/A': '白色钛金属',
  // 'MU2X3CH/A': '黑色钛金属',


}


const monitorIphoneStorage = async (productName) => {
  // 获取单个门店库存数据
  // const url = encodeURI(`https://www.apple.com.cn/shop/fulfillment-messages?pl=true&mts.0=regular&parts.0=${productName}&location=${locationName}`);
  // 查询 附近门店，searchNearby=false 查询指定门店
  const searchNearby = true;
  // 默认查询 浦东店
  const storeNum = 'R389';
  // 查询指定门店及附近门店数据
  const url = encodeURI(`https://www.apple.com.cn/shop/fulfillment-messages?pl=true&mts.0=regular&mts.1=compact&parts.0=${productName}&searchNearby=${searchNearby}&store=${storeNum}`);
  console.log(consoleColors.Reset, url);
  const res = await http.get(url);
  // console.log('res=>>>', res);
  const {
    stores
  } = res.body.body.content.pickupMessage;
  const {
    subHeader
  } = res.body.body.content.deliveryMessage[productName].regular;

  console.log(subHeader, productName);

  if (Array.isArray(stores) && stores.length > 0) {
    for (const store of stores) {
      try {
        const {
          pickupDisplay
        } = store.partsAvailability[productName];
        const color = pickupDisplay === 'available' ? consoleColors.FgGreen : consoleColors.FgRed;
        const { city, storeName } = store;
        console.log(color, city, storeName, pickupDisplay);
        pickupDisplay === 'available' && sound.play('Hey.m4a');
      } catch (e) {
        console.error(consoleColors.FgRed, '解析店铺信息出错');
      }
    }
  } else {
    console.log(consoleColors.FgRed, subHeader, {
      productName,
      storage: '无货可用商店',
    });
  }

}

// 选择颜色
const selectColors = [];

const startTask = async () => {
  console.time(`----------------刷新耗时----------------`);
  console.log(consoleColors.Reset, `----------------本次刷新开始 ${new Date().toLocaleString()}----------------\n`);
  for (const [productName, productColor] of Object.entries(models)) {
    try {
      if (selectColors.length === 0 || selectColors.includes(productColor)) {
        await monitorIphoneStorage(productName);
      }
    } catch (e) {
      console.error(e);
    }
    console.log(consoleColors.Reset, `----------------${new Date().toLocaleString()}----------------`);
  }
  console.log(consoleColors.Reset, `----------------本次刷新结束 ${new Date().toLocaleString()}----------------\n`);
  console.timeEnd(`----------------刷新耗时----------------`);
  console.log('\n');
}

/**
 * Run program in loop
 */
// const interval = setInterval(async () => {
//   await startTask();
// }, 1000 * (30 + Math.floor(Math.random()*10))); // Fetch interval 刷新周期，别太快。

// setTimeout(async () => {
//       clearInterval(interval);
//       console.log(consoleColors.Reset, `----------------定时任务结束 ${new Date().toLocaleString()}----------------`);
//       process.exit();
//     }, 10 * 60 * 1000);


// 周期性运行定时任务
// 开始时间
const startTime = new Date(Date.now());
// 结束时间， 持续运行时间要大于 开始运行的时间，否则定制任务不会执行
// 设定持续运行时间 24小时
const endTime = new Date(startTime.getTime() + 24 * 3600 * 1000);

// 切忌 请求过快，可能会被封IP
// 每2分钟执行一次 0 0/2 * * * ?
// 每天 15:00 - 19:00 每3分钟执行一次
schedule.scheduleJob({ start: startTime, end: endTime, rule: '0 0/3 15,16,17,18 * * ?' }, function(){
    // 设置一个相对随机的延迟，避免固定时间访问
    const timeOut = Math.floor(Math.random()*10) * 1000;
    setTimeout(async () => {
      await startTask();
    }, timeOut);
});

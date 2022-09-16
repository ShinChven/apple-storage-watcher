const http = require('superagent');
const consoleColors = require('./console-colors');
const sound = require('sound-play');

/**
 * 型号 : 地址
 * @type {{'MQ203CH/A': string, 'MPUJ3CH/A': string}}
 */
const models = {
		'MQ203CH/A': '河南 郑州 二七区',
		'MPUJ3CH/A': '河南 郑州 二七区',
}


const monitorIphoneStorage = async (productName, locationName) => {
		const url = encodeURI(`https://www.apple.com.cn/shop/fulfillment-messages?pl=true&mts.0=regular&parts.0=${productName}&location=${locationName}`);
		console.log(consoleColors.BgBlack, url);
		const res = await http.get(url);

		const {
				stores
		} = res.body.body.content.pickupMessage;
		const {
				subHeader
		} = res.body.body.content.deliveryMessage[productName].regular;

		console.log(subHeader, productName, locationName);

		if (Array.isArray(stores) && stores.length > 0) {
				for (const store of stores) {
						try {
								const {
										pickupDisplay
								} = store.partsAvailability[productName];
								const color = pickupDisplay === 'available' ? consoleColors.BgGreen : consoleColors.BgRed;
								console.log(color, store.storeName, pickupDisplay);
								pickupDisplay === 'available' && sound.play('Hey.m4a');
						} catch (e) {
								console.error(consoleColors.BgRed, '解析店铺信息出错');
						}
				}
		} else {
				console.log(consoleColors.BgRed, subHeader, {
						productName,
						locationName,
						storage: '无货可用商店',
				});
		}


}

/**
 * Run program in loop
 */
setInterval(async () => {
		for (const [productName, locationName] of Object.entries(models)) {
				try {
						await monitorIphoneStorage(productName, locationName);
				} catch (e) {
						console.error(e);
				}
				console.log(consoleColors.BgBlack, '----------------------------------------');
		}
}, 1000 * 5); // Fetch interval 刷新周期，别太快。

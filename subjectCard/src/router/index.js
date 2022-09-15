import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import axios from 'axios'
import store from './../store'
import { Toast } from "vant";

Vue.use(Router)
const router = new Router({
	// mode: 'history',
	routes,
})

// 解决重复点击相同路由报错问题
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
	return VueRouterPush.call(this, to).catch(err => err)
}

axios.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 齐鲁工惠获取用户状态
function getUserStatusByApp(param) {
	return new Promise(function (resolve, reject) {
		labor.getLaborStatus(function (res) {
			console.log("laborStatus", res.laborStatus)
			// 齐鲁工惠未登录
			if ((res.laborStatus == undefined || res.laborStatus == 0) && !param.memberId) {
				reject("/noIdent");
			} else {
				resolve("chenggong");
			}
		});
	});
}
// 齐鲁工惠获取用户信息
function getUserInfoByApp(param) {
	return new Promise(function (resolve, reject) {
		labor.getUserInfo(function (obj) {
			console.log(JSON.stringify(obj));
			// 非齐鲁工惠进入
			if (obj.error == "no data") {
				if (param.memberId) {
					resolve("chenggong");
				} else {
					reject("/error");
				}
			} else {
				if (obj.memberId) {
					store.commit("setMyUserInfo", obj);
					labor.openWxapp("gh_d2d4ac0592eb", "/pages/index/index?memberId=" + obj.memberId + "&userPhone=" + obj.userPhone + "&userIcon=" + encodeURIComponent(obj.userIcon) + "&fullName=" + encodeURIComponent(obj.fullName) + "&laborName=" + encodeURIComponent(obj.laborName));
					// resolve("chenggong");
					reject("/default");
				} else {
					reject("/noLogin")
				}
			}
		});
	});
}
// 登录
function goLogin(param) {
	return new Promise(function (resolve, reject) {
		axios.post(baseUrl + "/applet/login", param).then((ress) => {
			let res = ress.data;
			if (res.code == 200) {
				store.commit("setMyToken", resss.token);
				resolve("chenggong");
			} else {
				reject(res.msg);
			}
		}).catch(() => {
			reject("登录失败");
		});
	});
}

router.beforeEach((to, from, next) => {
	if (to.meta.title) {
		document.title = to.meta.title;
	}
	let param = {
		memberId: to.query.memberId,
		// userPhone: to.query.userPhone,
		userIcon: decodeURIComponent(to.query.userIcon),
		// fullName: decodeURIComponent(to.query.fullName),
		// laborName: decodeURIComponent(to.query.laborName),
	}
	console.log('memberId', to.query.memberId)
	// console.log(param);
	store.commit("setMyModelURL", "https://zxsbzzqjk.qdszgh.cn/model.json");
	store.commit("setMyMetadataURL", "https://zxsbzzqjk.qdszgh.cn/metadata.json");
	// next();
	var userInfo = store.getters.getUserInfo; // 获取缓存中的用户信息，若取到，则放行，若未取到，则调取齐鲁工惠接口获取用户信息存至缓存，若获取不到用户信息，则跳至相应错误页面
	var baseUrl = store.getters.getBaseUrl; // 获取缓存中的baseUrl
	if (to.path !== '/error' && to.path !== '/noIdent' && to.path !== '/noLogin' && to.path !== '/default' && (!userInfo || JSON.stringify(userInfo) == "{}")) {
		getUserStatusByApp(param).then(function onFulfilled(value) {
			getUserInfoByApp(param).then(function onFulfilled(value) {
				// userInfo = store.getters.getUserInfo;
				// labor.openWxapp("gh_a9c31fbb5d5f", "/pages/index/index?memberId=" + userInfo.memberId + "&userPhone=" + userInfo.userPhone + "&userIcon=" + encodeURIComponent(userInfo.userIcon) + "&fullName=" + encodeURIComponent(userInfo.fullName) + "&laborName=" + encodeURIComponent(userInfo.laborName));
				axios.post(baseUrl + "/applet/login", param).then((ress) => {
					let res = ress.data;
					if (res.code == 200) {
						store.commit("setMyToken", res.token);
						next()
					} else {
						// Toast.fail(res.msg);
						// next()
						let flag = true;
						for (let i = 0; i < 3; i++) {
							goLogin(param).then(function onFulfilled(value) {
								next();
								flag = false;
							}).catch(function onRejected(error) {
								if (i == 2) {
									Toast.fail(error);
									next();
								}
							});
							if (!flag) {
								break;
							}
						}
					}
				}).catch(() => {
					// Toast.fail('登录失败');
					// next();
					let flag = true;
					for (let i = 0; i < 3; i++) {
						goLogin(param).then(function onFulfilled(value) {
							next();
							flag = false;
						}).catch(function onRejected(error) {
							if (i == 2) {
								Toast.fail(error);
								next();
							}
						});
						if (!flag) {
							break;
						}
					}
				});
			}).catch(function onRejected(error) {
				if (error == "/default") {
					next();
				} else {
					next(error);
				}
			});
		}).catch(function onRejected(error) {
			next(error);
		});
	} else {
		next();
	}
})


export default router
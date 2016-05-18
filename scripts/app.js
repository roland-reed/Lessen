require.config({
	paths: {
		vue: "https://cdn.bootcss.com/vue/1.0.24/vue.min",
		reqwest: "https://cdn.bootcss.com/reqwest/2.0.5/reqwest.min",
		qwery: "https://cdn.bootcss.com/qwery/4.0.0/qwery.min"
	}
});

require(['vue', 'qwery', 'reqwest'], function(Vue, qwery, reqwest) {
	// 网络错误
	function networkError() {
		app.toastMsg = "无法连接网络";
		app.toast = true;
		setTimeout(function() {
			app.toast = false;
		}, 3000);
	}

	// 上课时间格式化
	Vue.filter("timeFormat", function(value) {
		if (!value) {
			return ""
		};
		var arr = value.toString().split(""),
			len = arr.length,
			day,
			classTime,
			dayArr = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
		day = dayArr[parseInt(arr[0])];
		if (len === 3) {
			classTime = arr[2];
		} else if (len === 5) {
			classTime = " " + arr[2] + "、" + parseInt(arr[3] + arr[4]) + " 节"
		}
		return day + classTime;
	});

	// 课程类型格式化
	Vue.filter("typeFormat", function(value) {
		var typeArr = ["暂无数据", "社会科学与人类发展", "传统文化与世界文明", "医学与生命科学", "人文学科与艺术审美", "自然科学与现代技术"];
		return typeArr[parseInt(value)];
	});

	// 点名类型格式化
	Vue.filter("rollFormat", function(value) {
		var rollArr = ["暂无数据", "频繁点名", "经常点名", "偶尔点名", "从不点名"];
		return rollArr[parseInt(value)];
	});

	// 考试类型格式化
	Vue.filter("examFormat", function(value) {
		var examType = ["暂无数据", "闭卷考试", "开卷考试", "论文"];
		return examType[parseInt(value)];
	});

	// 老师评分格式化
	Vue.filter("teacherScoreFormat", function(value) {
		if (isNaN(value)) {
			return "";
		} else {
			return value / 100;
		}
	});

	// 创建Vue实例
	var app = new Vue({
		el: "#app",
		data: {
			// 分页是否显示
			top: true,
			detail: false,
			filter: false,
			search: false,
			help: false,
			rating: false,

			// 标题栏和搜索栏是否显示
			title: true,
			searchBox: false,
			searchBtn: true,

			// toast是否显示及内容
			toast: false,
			toastMsg: "",

			// 当前页和前一页
			currentPage: "top",
			previousPage: "top",

			// 在排行榜二级导航是否展开及内容块是否向下平移
			headExpand: {
				"head-expand": true
			},
			bodyExpand: {
				"body-expand": true
			},

			// 详细信息页返回按钮是否显示
			detailBack: {
				"detail-back": false
			},

			// 当前页的标题和标题数组
			currentPageTitle: "排行榜",
			pageTitle: {
				"top": "排行榜",
				"filter": "筛选",
				"search": "搜索",
				"help": "帮助",
				"rating": "评分",
				"detail": "详细信息"
			},

			// 标题栏颜色和颜色数组
			headBg: {
				"background-color": "#db4437"
			},
			headBgColors: {
				"top": "#db4437",
				"filter": "#03a9f4",
				"search": "#455a64",
				"help": "#0f9d58",
				"rating": "#ffa000",
				"detail": "#785447"
			},

			// 是否显示导航
			nav: {
				"nav-hide": true
			},

			mask: false, // 是否显示蒙版
			tops: null, // 排行榜数据
			filters: null, // 筛选数据
			filtering: false, // 是否显示正在筛选
			filterEmpty: false, // 是否筛选结果为空
			searchs: null, // 搜索数据
			searching: false, // 是否显示正在搜索
			searchEmpty: false, // 是否显示搜索结果为空
			detailData: {}, // 详细信息数据
			detailFetching: false, // 是否显示正在获取详细信息
			ratingSelected: {}, // 将要评分的课程信息
			ratingSearchs: null, // 评分页搜索结果
			ratingSearching: false, // 评分页是否显示正在搜素
			ratingSearchEmpty: false, // 评分页是否显示搜索结果为空
			gettingDetail: false, // 评分页是否显示正在获取信息
			teacherScore: 10 // 老师评分
		},

		// 实例创建并渲染完成后移除正在启动页
		ready: function() {
			var startPage = qwery("#start-page")[0],
				content = qwery("p", startPage)[0];
			content.innerText = "即将完成...";
			setTimeout(function() {
				startPage.remove();
			}, 1000);
		},

		computed: {
			// 如果在详细信息页则显示返回按钮
			detailBack: function() {
				return {
					"detail-back": this.detail
				}
			}
		},

		methods: {
			showNav: function(e) {
				// 如果是在详细信息页点击返回按钮
				// 则将返回按钮上的detail-back类名去除
				// 并返回上一页
				if (e.target.classList.contains("detail-back")) {
					var navs = qwery("li", qwery(".nav")[0]),
						i, len;

					for (i = 0, len = navs.length; i < len; i++) {
						if (navs[i].getAttribute("data-page") === this.previousPage) {
							qwery(".nav-title", navs[i])[0].click();
						}
					}
				} else {
					this.nav["nav-hide"] = false;
					this.mask = true;
				}
			},

			hideNav: function() {
				this.nav["nav-hide"] = true;
				this.mask = false;
			},

			changePage: function(e) {
				var that = this,
					// 如果点击的是标题栏的搜索按钮则page为search
					// 否则为event.target的父元素上data-page的属性值
					page = /search/.test(e.target.className) ? "search" : e.target.parentNode.getAttribute("data-page");

				this[this.currentPage] = false;
				this.previousPage = this.currentPage;
				this.hideNav();
				if (page === "search") {
					setTimeout(function() {
						that.title = false;
						that.searchBtn = false;
						that.searchBox = true;
					}, 300);
				} else {
					that.title = true;
					that.searchBtn = true;
					that.searchBox = false;
				}
				setTimeout(function() {
					that[page] = true;
					that.currentPage = page;
					that.currentPageTitle = that.pageTitle[page];
					that.headBg["background-color"] = that.headBgColors[page];
					if (page === "top") {
						that.headExpand["head-expand"] = true;
						that.bodyExpand["body-expand"] = true;
					} else {
						that.headExpand["head-expand"] = false;
						that.bodyExpand["body-expand"] = false;
					}
				}, 300);
			},

			// 切换选项是否选中样式
			toggleOption: function(e) {
				var target = e.target,
					options,
					i;

				if (target.classList.contains("option")) {
					options = qwery(".option", target.parentNode);
					for (i = options.length - 1; i >= 0; i--) {
						options[i].classList.remove("option-active");
					};
					target.classList.add("option-active");
				}
			},

			// 筛选
			filterDone: function(e) {
				var options = qwery(".option-active"),
					btn = e.target,
					defaultText = btn.innerText,
					that = this,
					postArray = [],
					i, len,
					postString;

				for (i = 0, len = options.length; i < len; i++) {
					postArray.push(options[i].getAttribute("data-option"));
				};
				this.filters = null;
				this.filtering = true;
				this.filterEmpty = false;
				postString = postArray.join("&");
				btn.innerText = "正在筛选...";
				reqwest({
					url: 'api/?action=filter' + "&t=" + Math.random(),
					method: 'post',
					data: postString,
					type: 'json',
					success: function(res) {
						app.filtering = false;
						btn.innerText = defaultText;
						if (res.count === 0) {
							app.filterEmpty = true;
							app.toastMsg = "抱歉，没有符合条件的结果";
							app.toast = true;
							setTimeout(function() {
								app.toast = false;
							}, 3000);
						} else {
							app.filters = res.data;
							app.toastMsg = "向上滑动来查看" + res.count + "条结果";
							app.toast = true;
							setTimeout(function() {
								app.toast = false;
							}, 3000);
						}
					},
					error: function() {
						networkError();
						e.target.innerText = defaultText;
					}
				});
			},

			teacherScoreChange: function(e) {
				this.teacherScore = e.target.value;
			},

			// 提交评分
			ratingSubmit: function(e) {
				var items = qwery(".option-active", e.target.parentNode),
					defaultText = e.target.innerText,
					postArray = [],
					postString,
					i, len;

				for (i = 0, len = items.length; i < len; i++) {
					postArray.push(items[i].getAttribute("data-option"));
				};
				postArray.push("teacherScore=" + this.teacherScore);
				postArray.push("comment=" + qwery("#rating-comment")[0].innerText);
				postArray.push("code=" + this.ratingSelected.code);
				postString = postArray.join("&");
				e.target.innerText = "正在提交...";
				reqwest({
					url: 'api/?action=rate' + "&t=" + Math.random(),
					method: 'post',
					data: postString,
					type: 'json',
					success: function(res) {
						qwery("#rating-search-input")[0].value = "";
						app.ratingSearchs = {};
						e.target.innerText = defaultText;
						app.ratingSelected = {
							code: "",
							name: "",
							teacher: "",
							time: "",
							type: ""
						}
						app.toastMsg = "评价成功";
						app.toast = true;
						setTimeout(function() {
							app.toast = false;
						}, 3000);
					},
					error: function() {
						networkError();
						e.target.innerText = defaultText;
					}
				});
			},

			// 切换二级导航栏
			tabSwitch: function(e) {
				var ul = e.target.parentNode,
					li = qwery("li", ul),
					type = e.target.getAttribute("data-type"),
					i, len;
				for (i = 0, len = li.length; i < len; i++) {
					li[i].classList.remove("tab-li-current");
				}
				e.target.classList.add("tab-li-current");
				this.tops = null;
				reqwest({
					url: 'api/?action=top&type=' + type + "&t=" + Math.random(),
					method: 'get',
					type: 'json',
					success: function(res) {
						app.tops = res.data;
					},
					error: function() {
						networkError();
					}
				});
			},

			// 搜索
			searchAction: function(e) {
				var q = e.target.value;
				this.searchs = null;
				this.searching = true;
				this.searchEmpty = false;
				e.target.blur();
				reqwest({
					url: 'api/?action=search&q=' + q + "&t=" + Math.random(),
					method: 'get',
					type: 'json',
					success: function(res) {
						app.searching = false;
						if (res.count === 0) {
							app.searchEmpty = true;
						} else {
							app.searchs = res.data;
							app.toastMsg = "共" + res.count + "条结果";
							app.toast = true;
							setTimeout(function() {
								app.toast = false;
							}, 3000);
						}
					},
					error: function() {
						networkError();
					}
				});
			},

			// 评分页搜索课程
			ratingSearch: function(e) {
				var q = e.target.value,
					noDuplicatedArray = [],
					count;

				this.ratingSearchs = null;
				this.ratingSearching = true;
				this.ratingSearchEmpty = false;
				e.target.blur();
				reqwest({
					url: 'api/?action=search&q=' + q + "&t=" + Math.random(),
					method: 'get',
					type: 'json',
					success: function(res) {
						app.ratingSearching = false;
						res.data.forEach(function(i) {
							count = 0;
							if (noDuplicatedArray.length === 0) {
								noDuplicatedArray.push(i);
							} else {
								noDuplicatedArray.forEach(function(j) {
									if (i.code === j.code && i.teacher === j.teacher) {
										count++;
									}
								});
								if (count === 0) {
									noDuplicatedArray.push(i);
								}
							}
						});
						if (res.count === 0) {
							app.ratingSearchEmpty = true;
						} else {
							app.ratingSearchs = noDuplicatedArray;
						}
					},
					error: function() {
						networkError();
					}
				});
			},

			// 将要评分的课程信息写入ratingSelected属性中
			ratingSelectCourse: function(e) {
				var id, i,
					node = e.target;
				for (i = 0; i < 3; i++) {
					if (node.nodeName.toUpperCase() === "LI") {
						id = node.getAttribute("data-id");
					} else {
						node = node.parentNode;
					}
				}
				this.ratingSelectedId = id;
				this.gettingDetail = true;
				reqwest({
					url: 'api/?action=detail&id=' + id + "&t=" + Math.random(),
					method: 'get',
					type: 'json',
					success: function(res) {
						app.gettingDetail = false;
						app.ratingSelected = res.data[0];
					},
					error: function() {
						networkError();
					}
				});
			},

			// 显示课程详细信息
			showDetail: function(e) {
				var id, i,
					node = e.target,
					that = this,
					page = "detail";

				for (i = 0; i < 4; i++) {
					if (node.nodeName.toUpperCase() === "LI") {
						id = node.getAttribute("data-id");
					} else {
						node = node.parentNode;
					}
				}
				this.detailData = {};
				this.detailFetching = true;
				this[this.currentPage] = false;
				this.previousPage = this.currentPage;
				setTimeout(function() {
					that.title = true;
					that.searchBtn = true;
					that.searchBox = false;
					that[page] = true;
					that.currentPage = page;
					that.currentPageTitle = that.pageTitle[page];
					that.headBg["background-color"] = that.headBgColors[page];
					if (page === "top") {
						that.headExpand["head-expand"] = true;
						that.bodyExpand["body-expand"] = true;
					} else {
						that.headExpand["head-expand"] = false;
						that.bodyExpand["body-expand"] = false;
					}
				}, 300);
				reqwest({
					url: 'api/?action=detail&id=' + id + "&t=" + Math.random(),
					method: 'get',
					type: 'json',
					success: function(res) {
						app.detailFetching = false;
						app.detailData = res.data[0];
					},
					error: function() {
						networkError();
					}
				});
			},

			// 详细信息页对当前课程评分
			ratingCourse: function(e) {
				var id = e.target.getAttribute("data-id");
				var navs = qwery("li", qwery(".nav")[0]);
				for (var i = 0, len = navs.length; i < len; i++) {
					if (navs[i].getAttribute("data-page") === "rating") {
						qwery(".nav-title", navs[i])[0].click();
					}
				}
				this.ratingSelectedId = id;
				this.gettingDetail = true;
				reqwest({
					url: 'api/?action=detail&id=' + id + "&t=" + Math.random(),
					method: 'get',
					type: 'json',
					success: function(res) {
						app.gettingDetail = false;
						app.ratingSelected = res.data[0];
					},
					error: function() {
						networkError();
					}
				});
			}
		}
	});

	// 初始化排行榜数据
	qwery(".tab-li-current")[0].click();
});
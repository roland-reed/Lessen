require.config({
	paths: {
		vue: 'https://cdn.bootcss.com/vue/1.0.26/vue.min',
		reqwest: 'https://cdn.bootcss.com/reqwest/2.0.5/reqwest.min',
		qwery: 'https://cdn.bootcss.com/qwery/4.0.0/qwery'
	}
});

require(['vue', 'reqwest', 'qwery'], function(Vue, reqwest, $) {
	new Vue({
		el: '#app',
		data: {
			// 全局状态
			isShowSidebar: false,
			showSearch: false,
			windowShow: {
				detail: false,
				hotList: true,
				filter: false,
				rate: false,
				search: false,
				help: false,
				about: false
			},
			loading: {
				hotList: true,
				detail: false,
				filter: false,
				rate: false,
				search: false
			},
			error: {
				detail: false,
				filter: false,
				search: false
			},
			// 侧边栏状态
			slideToHideSidebarPosition: {
				startX: 0,
				startY: 0,
				movedX: 0,
				movedY: 0
			},
			slideTabPosition: {
				startX: 0,
				startY: 0
			},
			previousSidebar: 'hotList',
			// 标题栏
			title: '热门课程',
			titleText: config.titleText,
			titleBackgroundColor: config.titleBackgroundColor,
			titleContainerStyle: {
				'background-color': '#db4437'
			},
			tabBarPosition: {
				transform: '0px'
			},
			// class
			titleContainerClass: {
				'tab-expand': true,
				'title-reverse': false
			},
			tabContainerClass: {
				'support-touch': false
			},
			windowContainerClass: {
				'window-container-expand': true
			},
			// 数据
			hotList: null,
			searchResult: null,
			filterResult: null,
			toast: {
				show: false,
				message: ''
			},
			filterOptions: {
				rate: 'default',
				roll: 'default',
				exam: 'default',
				type: 'default',
				time: 'default'
			},
			filterConditions: config.filterConditions,
			rateCourseSelected: false,
			rateSearchResult: null,
			rateOptions: {
				code: '',
				name: '',
				teacher: '',
				time: '',
				roll: 'never',
				exam: 'paper',
				teacherScore: 6,
				nickname: '',
				comment: ''
			},
			detail: {
				name: '',
				teacher: '',
				time: '',
				type: '',
				roll: '',
				rateTimes: '',
				score: '',
				commentTimes: '',
				comments: []
			},
			rateConditions: config.rateConditions
		},
		ready() {
			// 在iOS Safari中启用:active伪类
			document.addEventListener('touchstart', function() {}, true);

			// 如果折·用户代理支持触摸则开启课程类别触摸支持
			if ('createTouch' in document) {
				this.tabContainerClass['support-touch'] = true;
			}
			// 展开所有筛选条件/评分条件菜单
			[...$('.main-filter h3')].forEach(function(h3) {
				h3.click();
			});
			// 初始化加载首页数据
			this.loadHotList('all');
		},
		methods: {
			toggleSidebar() {
				this.isShowSidebar = !this.isShowSidebar;
			},
			back() {
				this.changeWindow(this.previousSidebar);
			},
			preventMask(e) {
				// 当侧边栏显示时防止页面滚动
				e.preventDefault();
			},
			changeRateCourse() {
				this.rateCourseSelected = false;
			},
			showToast(msg) {
				// 显示通知
				this.toast.message = msg;
				this.toast.show = true;
				clearTimeout(this.toastTimeoutId);
				this.toastTimeoutId = setTimeout(() => {
					this.toast.show = false;
				}, 3000);
			},
			slideToToggleSidebar(action, e) {
				let type = e.type;
				let sidebar = $('#sidebar')[0];
				let movedX = 0;
				let movedY = 0;

				switch (type) {
					case 'touchstart':
						// 增加transition为linear的class，不然会出现侧边栏不跟随手指的情况
						sidebar.classList.add('on-touch-move');
						this.slideToHideSidebarPosition.startX = e.touches[0].clientX;
						this.slideToHideSidebarPosition.startY = e.touches[0].clientY;
						break;

					case 'touchmove':
						// 计算移动的距离
						movedX = e.touches[0].clientX - this.slideToHideSidebarPosition.startX;
						movedY = Math.abs(e.touches[0].clientY - this.slideToHideSidebarPosition.startY);

						if (movedY < 25) {
							// 让侧边栏跟随手指滑动
							if (action === 'hide') {
								movedX = movedX > 0 ? 0 : movedX;
								sidebar.style.transform = 'translateX(' + movedX + 'px)';
								e.preventDefault();
							} else if (action === 'open' && movedX > 50) {
								movedX = movedX > 210 ? 210 : movedX;
								sidebar.style.transform = 'translateX(' + (-210 + movedX) + 'px)';
								e.preventDefault();
							} else {
								sidebar.style.transform = 'translateX(' + (-210 + movedX) + 'px)';
							}
							this.slideToHideSidebarPosition.movedX = movedX;
							this.slideToHideSidebarPosition.movedY = movedY;
						}
						break;

					case 'touchend':
						// 移除css中的transition属性
						sidebar.classList.remove('on-touch-move');

						// 如果手指滑动小于25px则回到原先的状态
						if (action === 'hide' && this.slideToHideSidebarPosition.movedX < -50 && this.slideToHideSidebarPosition.movedY < 25) {
							sidebar.style.transform = 'translateX(-210px)';
							sidebar.removeAttribute('style');
							this.isShowSidebar = false;
							e.preventDefault();
						} else if (action === 'open' && this.slideToHideSidebarPosition.movedX > 50 && this.slideToHideSidebarPosition.movedY < 25) {
							sidebar.style.transform = 'translateX(0px)';
							sidebar.removeAttribute('style');
							this.isShowSidebar = true;
							e.preventDefault();
						} else {
							// 当手指滑动超过25px，才会显示/隐藏侧边栏
							if (action === 'hide') {
								sidebar.style.transform = 'translateX(0px)';
							} else if (action === 'open') {
								sidebar.style.transform = 'translateX(-210px)';
							}

							setTimeout(() => {
								sidebar.removeAttribute('style');
								sidebar.classList.remove('on-touch-move');
							}, 300);
						}

						this.slideToHideSidebarPosition.movedX = 0;
						this.slideToHideSidebarPosition.movedY = 0;
						break;

					case 'touchcancel':
						sidebar.classList.remove('on-touch-move');
						sidebar.removeAttribute('style');
						break;
				}
			},
			changeTab(e, noLoadFlag) {
				let target = e.target;
				let preTab = target.parentNode.getElementsByTagName('li');
				let previousIndex, index, type, position;

				if (target.nodeName.toUpperCase() !== 'LI') return;

				[...preTab].forEach(function(li) {
					if (li.classList.contains('tab-current')) {
						previousIndex = +li.getAttribute('data-index');
					}
					li.classList.remove('tab-current');
				});

				target.classList.add('tab-current');
				index = +target.getAttribute('data-index');
				type = target.getAttribute('data-type');
				position = 'translateX(' + (index * 150) + 'px)';
				this.tabBarPosition.transform = position;

				if (!noLoadFlag) {
					this.loadHotList(type, previousIndex);
				}
			},
			loadHistoryHostlist(type, previousIndex) {
				let timeStr = '',
					data;

				type = 'hotLists' + type.slice(0, 1).toUpperCase() + type.slice(1);
				data = window.localStorage[type] ? JSON.parse(window.localStorage[type]) : false;
				this.loading.hotList = false;

				if (!data) {
					let e = {
						target: $('.tab li')[previousIndex]
					};

					this.showToast(config.MSG.NETWORK_ERROR);
					this.changeTab(e, true);
				} else {
					let d = new Date(data.time);

					timeStr += `${d.getFullYear()}年${(d.getMonth()+1)}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
					this.showToast(config.MSG.SHOW_CACHED_DATA(timeStr));
					this.hotList = data.data;
				}
			},
			loadHotList(type, previousIndex) {
				// 参数previousIndex是为了应对网络连接失败的
				// 如果网络连接失败，二级菜单中指示当前课程类型的白色条应该回到之前的位置，避免误解
				this.loading.hotList = true;

				reqwest({
					url: `/lessen/hotLists/${type}`,
					type: 'json'
				}).then(res => {
					if (res.code === 0) {
						type = 'hotLists' + type.slice(0, 1).toUpperCase() + type.slice(1);
						this.hotList = res.data;
						window.localStorage.removeItem(type);
						window.localStorage[type] = JSON.stringify(res);
						this.loading.hotList = false;
					} else {
						this.loadHistoryHostlist(type, previousIndex);
					}
				}).fail(() => {
					this.loadHistoryHostlist(type, previousIndex);
				});
			},
			showDetail(e) {
				let target = e.target,
					code;

				while (target.nodeName.toUpperCase() !== 'LI') {
					target = target.parentNode;
				}

				code = target.getAttribute('data-code');
				this.changeWindow('detail');
				this.loadDetail(code);
			},
			detailRate() {
				let keys = ['code', 'name', 'teacher', 'time'];

				this.changeWindow('rate');
				this.rateCourseSelected = true;
				keys.forEach(key => {
					this.rateOptions[key] = this.detail[key];
				});
			},
			loadDetail(code) {
				this.loading.detail = true;

				reqwest({
					url: `/lessen/detail/${code}`,
					type: 'json'
				}).then(res => {
					if (res.code === 0) {
						this.loading.detail = false;
						this.detail = res.data;
					} else {
						this.loading.detail = false;
						this.error.detail = true;
						this.showToast(config.MSG.NETWORK_ERROR);
					}
				}).fail(() => {
					this.loading.detail = false;
					this.error.detail = true;
					this.showToast(config.MSG.NETWORK_ERROR);
				});
			},
			search(e, type) {
				let q = e.target.value;
				let data;

				if (type === 'rate') {
					this.rateSearchResult = [];
				} else {
					this.searchResult = [];
				}

				if (!q) {
					this.searchResult = null;
					return;
				}

				data = {
					q: q
				};

				this.loading[type] = true;

				reqwest({
					url: '/lessen/search',
					type: 'json',
					data: data
				}).then(res => {
					if (res.code === 0) {
						this.loading[type] = false;
						if (type === 'rate') {
							this.rateSearchResult = res.data;
						} else {
							this.searchResult = res.data;
						}
					}
				}).fail(() => {
					this.loading[type] = false;
					this.showToast(config.MSG.NETWORK_ERROR);
				});
			},
			selectRateCourse(e) {
				let target = e.target;
				let code;

				while (target.nodeName.toUpperCase() !== 'LI') {
					target = target.parentNode;
				}

				code = +target.getAttribute('data-code');
				this.rateSearchResult.forEach(course => {
					if (+course.code === code) {
						this.rateOptions.code = code;
						this.rateOptions.name = course.name;
						this.rateOptions.time = course.time;
						this.rateOptions.teacher = course.teacher;
					}
				});
				this.rateCourseSelected = true;
			},
			submitRate(e) {
				let target = e.target;
				let comment = $('#rate-comment')[0];
				let optionLi = $('#rate-options .main-filter>li>h3');
				let input = $('#rate-search-input')[0];

				if (target.classList.contains('submitting')) {
					return;
				} else {
					if (!this.rateOptions.code) {
						this.showToast(config.MSG.SELECT_COURSE);
						return;
					}
					target.classList.add('submitting');
					target.innerText = config.MSG.SUBMITTING;
					this.rateOptions.comment = encodeURIComponent(comment.innerText);
				}

				reqwest({
					url: '/lessen/rate',
					method: 'POST',
					type: 'json',
					data: {
						code: this.rateOptions.code,
						roll: this.rateOptions.roll,
						exam: this.rateOptions.exam,
						teacherScore: this.rateOptions.teacherScore,
						comment: this.rateOptions.comment,
						nickname: encodeURIComponent(this.rateOptions.nickname)
					}
				}).then(res => {
					if (res.code === 0) {
						target.classList.remove('submitting');
						target.innerText = config.MSG.SUBMIT;
						this.showToast(config.MSG.SUBMIT_SUCCESS);
						this.rateCourseSelected = false;
						this.rateOptions.code = '';
						this.rateOptions.name = '';
						this.rateOptions.time = '';
						this.rateOptions.teacher = '';
						this.rateOptions.comment = '';
						this.rateSearchResult = null;
						comment.innerHTML = '<p style="color: #999;" id="rate-comment-placeholder">输入你的评价</p>';
						[...optionLi].forEach(function(li) {
							li.click();
						});
						input.value = '';
					} else {
						target.innerText = config.MSG.SUBMIT;
						this.showToast(config.MSG.NETWORK_ERROR);
						target.classList.remove('submitting');
					}
				}).fail(() => {
					target.innerText = config.MSG.SUBMIT;
					this.showToast(config.MSG.NETWORK_ERROR);
					target.classList.remove('submitting');
				});
			},
			wheel(e) {
				// 如果用户代理不支持触摸且窗口宽度不够显示所有课程类型
				// 则当鼠标在课程类型上滚动鼠标滚轮，就可以前后滑动类型列表，显示被隐藏的课程类型
				let tab = $('#tab-container')[0];
				let position = window.getComputedStyle(tab, null).getPropertyValue('transform');

				if (document.documentElement.clientWidth < 900) {
					e.preventDefault();
					position = position.match(/\-?\d+/g);
					position = position ? +position[4] : 0;
					// 限制位移不超过-750px
					// 限制位移不超过0px
					position = (e.deltaY > 0) ? ((position - 150 <= -750) ? -750 : position - 150) : ((position + 150 >= 0) ? 0 : position + 150);
					tab.style.transform = 'translateX(' + position + 'px)';
				}
			},
			changeWindow(windowOption) {
				Object.keys(this.windowShow).forEach(key => {
					if (this.windowShow[key]) {
						this.previousSidebar = key;
					}
					this.windowShow[key] = false;
				});

				// 如果切换到热门，则将二级菜单展开，否则隐藏。
				if (windowOption === 'hotList') {
					this.titleContainerClass['tab-expand'] = true;
					this.windowContainerClass['window-container-expand'] = true;
				} else {
					this.titleContainerClass['tab-expand'] = false;
					this.windowContainerClass['window-container-expand'] = false;
				}

				// 如果切换到非热门/评分/筛选（标题栏非白色），则切换标题栏的class，使其背景为白色，字为灰色
				if (windowOption !== 'hotList' && windowOption !== 'rate' && windowOption !== 'filter') {
					this.titleContainerClass['title-reverse'] = true;
				} else {
					this.titleContainerClass['title-reverse'] = false;
				}

				// 如果为搜索或者搜索按钮，则显示搜索
				if (windowOption === 'search' || windowOption === 'searchBtn') {
					this.showSearch = true;
				} else {
					this.showSearch = false;
				}

				// 由于切换不同页面时会记住上一页的位置，所以需要让页面滚动回顶部
				window.scrollTo(0, 0);

				// windowShow中没有searchBtn属性，所以把searchBtn转为search
				windowOption = windowOption === 'searchBtn' ? 'search' : windowOption;
				this.title = this.titleText[windowOption];
				this.titleContainerStyle['background-color'] = this.titleBackgroundColor[windowOption];
				this.windowShow[windowOption] = true;
				this.isShowSidebar = false;
			},
			rateComment(e) {
				let target = e.target;
				let placeholder = $('#rate-comment-placeholder');
				let selection = window.getSelection();
				let range = document.createRange();

				if (placeholder.length === 1) {
					placeholder[0].remove();
					range.setStart(target, 0);
					range.setEnd(target, 0);
					selection.removeAllRanges();
					selection.addRange(range);
				} else if (target.innerText === '') {
					target.innerHTML = '<p style="color: #999;" id="rate-comment-placeholder">输入你的评价</p>';
				}
			}
		}
	});
});
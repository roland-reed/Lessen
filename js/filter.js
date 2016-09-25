require(['vue'], function(Vue) {
	Vue.filter('courseType', function(type) {
		if (!type) return '';
		let set = {
			natureScience: '自然科学与现代技术',
			humanities: '人文学科与艺术审美',
			medicalScience: '医学与生命科学',
			societyScience: '社会科学与现代技术',
			traditionalCulture: '传统文化与世界文明'
		};
		return set[type];
	});

	Vue.filter('courseRoll', function(value) {
		if (!value) return '暂无数据';
		let set = {
			never: '从不点名',
			occasionally: '偶尔点名',
			often: '频繁点名',
			always: '必定点名'
		};
		return set[value];
	});

	Vue.filter('courseTime', function(value) {
		if (!value) return '';
		value = value.toString();
		let timeArr = [];
		let weekDay = +value.slice(0, 1) - 1;
		let weekSet = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
		for (let i = 0, len = parseInt(value.length / 2); i < len; i++) {
			let time = +value.slice(1 + 2 * i, 3 + 2 * i);
			if (time > 9) {
				timeArr.push(time);
			} else {
				timeArr.push('0' + time);
			}
		}
		return weekSet[weekDay] + timeArr.join('、') + '节';
	});

	Vue.filter('timeStamp', function(value) {
		if (!value) return '';
		let d = new Date(parseInt(value));
		return `${d.getFullYear()}年${(d.getMonth()+1)}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
	});
});
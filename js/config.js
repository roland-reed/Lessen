let config = {
	filterConditions: [{
		key: 'rate',
		keyText: '课程评分',
		values: [{
			value: 'default',
			text: '不排序'
		}, {
			value: 'desc',
			text: '从高到低'
		}, {
			value: 'asc',
			text: '从低到高'
		}]
	}, {
		key: 'roll',
		keyText: '点名情况',
		values: [{
			value: 'default',
			text: '不限'
		}, {
			value: 'never',
			text: '从不点名'
		}, {
			value: 'occasionally',
			text: '偶尔点名'
		}, {
			value: 'often',
			text: '频繁点名'
		}, {
			value: 'always',
			text: '必定点名'
		}]
	}, {
		key: 'exam',
		keyText: '期末考试',
		values: [{
			value: 'default',
			text: '不限'
		}, {
			value: 'paper',
			text: '论文'
		}, {
			value: 'openBookExam',
			text: '开卷考试'
		}, {
			value: 'closeBookExam',
			text: '闭卷考试'
		}]
	}, {
		key: 'time',
		keyText: '上课时间',
		values: [{
			value: 'default',
			text: '不限'
		}, {
			value: '40506',
			text: '周四下午5、6节'
		}, {
			value: '40708',
			text: '周四下午7、8节'
		}, {
			value: 'other',
			text: '其他上课时间'
		}]
	}, {
		key: 'type',
		keyText: '课程类型',
		values: [{
			value: 'default',
			text: '不限'
		}, {
			value: 'natureScience',
			text: '自然科学与现代技术'
		}, {
			value: 'societyScience',
			text: '社会科学与现代技术'
		}, {
			value: 'traditionalCulture',
			text: '传统文化与世界文明'
		}, {
			value: 'medicalScience',
			text: '医学与生命科学'
		}, {
			value: 'humanities',
			text: '人文学科与艺术审美'
		}]
	}],
	rateConditions: [{
		key: 'roll',
		keyText: '点名情况',
		values: [{
			value: 'never',
			text: '从不点名'
		}, {
			value: 'occasionally',
			text: '偶尔点名'
		}, {
			value: 'often',
			text: '频繁点名'
		}, {
			value: 'always',
			text: '必定点名'
		}]
	}, {
		key: 'exam',
		keyText: '期末考试',
		values: [{
			value: 'paper',
			text: '论文'
		}, {
			value: 'openBookExam',
			text: '开卷考试'
		}, {
			value: 'closeBookExam',
			text: '闭卷考试'
		}]
	}, {
		key: 'teacherScore',
		keyText: '老师评分',
		values: [{
			value: 6,
			text: '6分'
		}, {
			value: 7,
			text: '7分'
		}, {
			value: 8,
			text: '8分'
		}, {
			value: 9,
			text: '9分'
		}, {
			value: 10,
			text: '10分'
		}]
	}],
	titleBackgroundColor: {
		hotList: '#db4437',
		filter: '#03a9f4',
		rate: '#0f9d58',
		search: '#fff',
		help: '#fff',
		about: '#fff',
		detail: '#fff'
	},
	titleText: {
		hotList: '热门课程',
		filter: '筛选',
		rate: '评分',
		search: '搜索',
		help: '帮助',
		about: '关于',
		detail: '详情'
	},
	MSG: {
		NETWORK_ERROR: '网络连接失败，请检查网络连接',
		SHOW_CACHED_DATA: (time) => `网络连接失败，现在显示的是历史数据（${time}）`,
		SUBMITTING: '正在提交',
		SUBMIT: '提交',
		SELECT_COURSE: '请选择你要评分的课程',
		SUBMIT_SUCCESS: '提交成功，感谢你的分享'
	}
};
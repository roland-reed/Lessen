require(['vue', 'reqwest'], function(Vue, reqwest) {
	Vue.component('filter-conditions', {
		props: {
			showBtn: {
				type: Boolean,
				required: true
			},
			filterOptions: {
				type: Object,
				required: true,
				default: {
					rate: 'default',
					roll: 'default',
					exam: 'default',
					type: 'default',
					time: 'default'
				}
			},
			filterResult: [],
			filterLoading: false,
			filterError: false,
			filterConditions: {
				type: Array,
				required: true,
				validator: function(obj) {
					if (!utils.typeCheck(obj, 'Array')) return false;
					obj.forEach(function(value) {
						if (!value.key || !value.keyText || !value.values) return false;
						if (typeof value.key !== 'string') return false;
						if (typeof value.keyText !== 'string') return false;
						if (!Array.isArray(value.values)) return false;
						if (value.values.length === 0) return false;
					});
					return true;
				}
			}
		},
		template: ` <ul class="main-filter">
						<li v-for="filterCondition in filterConditions">
							<h3 @click="expandOrCollapse">
								<span v-text="filterCondition.keyText"></span><span class="icon-expand"></span>
								<span class="filter-selected" v-text="filterCondition.values[0].text"></span>
							</h3>
							<ul class="sub-filter" data-key="{{filterCondition.key}}" @click="changeFilterOption">
								<li v-for="option in filterCondition.values" data-value="{{option.value}}" v-text="option.text"></li>
							</ul>
						</li>
						<div v-if="showBtn" class="filter-btn" @click="filter">开始筛选</div>
					</ul>`,
		methods: {
			expandOrCollapse(e) {
				let target = e.target;
				while (target.nodeName.toUpperCase() !== 'H3') {
					target = target.parentNode;
				}
				if (target.classList.contains('filter-title-expand')) {
					target.parentNode.style.height = '48px';
					target.classList.remove('filter-title-expand');
				} else {
					let num = target.parentNode.querySelectorAll('ul li').length;
					let height = num * 40 + 48;
					target.parentNode.style.height = height + 'px';
					target.classList.add('filter-title-expand');
				}
			},
			changeFilterOption(e) {
				let target = e.target;
				let filterOption = target.parentNode.parentNode;
				if (target.nodeName.toUpperCase() !== 'LI') return;
				let filterUl = filterOption.querySelectorAll('ul')[0];
				let text = target.innerText;
				let key = filterUl.getAttribute('data-key');
				let value = target.getAttribute('data-value');

				this.filterOptions[key] = value;
				filterOption.querySelectorAll('h3 .filter-selected')[0].innerText = text;
				filterOption.querySelectorAll('h3')[0].click();
			},
			filter() {
				this.filterLoading = true;
				this.filterError = false;
				reqwest({
					url: `${devUrl}/lessen/filter`,
					type: 'json',
					data: this.filterOptions
				}).then(res => {
					this.filterLoading = false;
					window.scrollTo(0, 250);
					if (res.code === 0) {
						this.filterResult = res.data;
					}
				}).fail(() => {
					this.filterLoading = false;
					this.filterError = true;
				});
			}
		}
	});
});
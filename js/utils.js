let utils = {
	typeCheck(value, type) {
		let typeSet = {
			'undefined': '[object Undefined]',
			'null': '[object Null]',
			'Array': '[object Array]',
			'Function': '[Function Object]',
			'Nmuber': '[Nmuber Object]',
			'Object': '[object Object]',
			'String': '[String Object]'
		};

		if (!type) return false;
		if (!typeSet[type]) return false;
		return Object.prototype.toString.call(value) === typeSet[type] ? true : false;
	}
};
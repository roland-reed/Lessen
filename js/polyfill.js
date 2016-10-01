'use strict';

if (!Array.from) {
	Array.from = (function() {
		var toStr = Object.prototype.toString;
		var isCallable = function(fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function(value) {
			var number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function(value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// The length property of the from method is 1.
		return function from(arrayLike /*, mapFn, thisArg */ ) {
			// 1. Let C be the this value.
			var C = this;

			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Let lenValue be Get(items, ''length'').
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);

			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, ''length'', len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	}());
}

if ('document' in self) {

	// Full polyfill for browsers with no classList support
	if (!('classList' in document.createElement('_'))) {

		(function(view) {

			'use strict';

			if (!('Element' in view)) return;

			var
				classListProp = 'classList',
				protoProp = 'prototype',
				elemCtrProto = view.Element[protoProp],
				objCtr = Object,
				strTrim = String[protoProp].trim || function() {
					return this.replace(/^\s+|\s+$/g, '');
				},
				arrIndexOf = Array[protoProp].indexOf || function(item) {
					var
						i = 0,
						len = this.length;
					for (; i < len; i++) {
						if (i in this && this[i] === item) {
							return i;
						}
					}
					return -1;
				}
				// Vendors: please allow content code to instantiate DOMExceptions
				,
				DOMEx = function(type, message) {
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				},
				checkTokenAndGetIndex = function(classList, token) {
					if (token === '') {
						throw new DOMEx(
							'SYNTAX_ERR', 'An invalid or illegal string was specified'
						);
					}
					if (/\s/.test(token)) {
						throw new DOMEx(
							'INVALID_CHARACTER_ERR', 'String contains an invalid character'
						);
					}
					return arrIndexOf.call(classList, token);
				},
				ClassList = function(elem) {
					var
						trimmedClasses = strTrim.call(elem.getAttribute('class') || ''),
						classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
						i = 0,
						len = classes.length;
					for (; i < len; i++) {
						this.push(classes[i]);
					}
					this._updateClassName = function() {
						elem.setAttribute('class', this.toString());
					};
				},
				classListProto = ClassList[protoProp] = [],
				classListGetter = function() {
					return new ClassList(this);
				};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function(i) {
				return this[i] || null;
			};
			classListProto.contains = function(token) {
				token += '';
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function() {
				var
					tokens = arguments,
					i = 0,
					l = tokens.length,
					token, updated = false;
				do {
					token = tokens[i] + '';
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function() {
				var
					tokens = arguments,
					i = 0,
					l = tokens.length,
					token, updated = false,
					index;
				do {
					token = tokens[i] + '';
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function(token, force) {
				token += '';

				var
					result = this.contains(token),
					method = result ?
					force !== true && 'remove' :
					force !== false && 'add';

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function() {
				return this.join(' ');
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) { // IE 8 doesn't support enumerable:true
					if (ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}

		}(self));

	} else {
		// There is full or partial native classList support, so just check if we need
		// to normalize the add/remove and toggle APIs.

		(function() {
			'use strict';

			var testElement = document.createElement('_');

			testElement.classList.add('c1', 'c2');

			// Polyfill for IE 10/11 and Firefox <26, where classList.add and
			// classList.remove exist but support only one argument at a time.
			if (!testElement.classList.contains('c2')) {
				var createMethod = function(method) {
					var original = DOMTokenList.prototype[method];

					DOMTokenList.prototype[method] = function(token) {
						var i, len = arguments.length;

						for (i = 0; i < len; i++) {
							token = arguments[i];
							original.call(this, token);
						}
					};
				};
				createMethod('add');
				createMethod('remove');
			}

			testElement.classList.toggle('c3', false);

			// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
			// support the second argument.
			if (testElement.classList.contains('c3')) {
				var _toggle = DOMTokenList.prototype.toggle;

				DOMTokenList.prototype.toggle = function(token, force) {
					if (1 in arguments && !this.contains(token) === !force) {
						return force;
					} else {
						return _toggle.call(this, token);
					}
				};

			}

			testElement = null;
		}());

	}

}
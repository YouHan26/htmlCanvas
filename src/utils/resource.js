import logger from "./logger";

class Resource {
	constructor(onReady) {
		this.pool = new Map();

		this._counter = 0;
		this.onReady = onReady || function () {
		};
	}

	/**
	 * url like: 'data:image/gif;base64,R0lGODlhCwALAIAAAAAA3pn/ZiH5BAEAAAEALAAAAAALAAsAAAIUhA+hkcuO4lmNVindo7qyrIXiGBYAOw==';
	 * @param name
	 * @param url
	 */
	addResourceUrl(name, url) {
		if (this.pool.get(name)) {
			return;
		}
		this._loadStart(name);
		const img = new Image();
		img.onload = function (source) {
			this._loadEnd(name);
			this.pool.set(name, source);
		};
		img.onerror = function (error) {
			this._loadEnd(name);
			console.log('source' + name + 'load error', error);
		};
		img.src = url;
	}

	loadHelper(url) {
		return new Promise(function (resolve, reject) {
			const img = new Image();
			img.onload = function (source) {
				resolve(img);
			};
			img.onerror = function (error) {
				console.log(error);
			};
			img.src = url;
		});
	}

	/**
	 * addResourceUrls
	 * @param names
	 * @param urls
	 */
	addResourceUrls(names, urls) {
		const that = this;
		names.forEach(function (name, index) {
			that.addResourceUrl(name, urls[index]);
		});
	}

	/**
	 * getResourceByName
	 * @param name
	 * @returns {*}
	 */
	getResourceByName(name) {
		const data = this.pool.get(name);
		// TODO check data is loading?
		if (!data) {
			logger.error('no resource ', name);
			return null;
		}
		return data;
	}

	addResource(name, source) {
		this.pool.set(name, source);
	}

	/**
	 * addResources
	 * @param names
	 * @param sources
	 */
	addResources(names, sources) {
		names.forEach(function (name, index) {
			this.addResource(name, sources[index]);
		}.bind(this));
	}

	_loadStart(name) {
		this._counter++;
	}

	_loadEnd(name) {
		if (--this._counter <= 0) {
			this._counter = 0;
			this.onReady();
		}
	}
}

function sourceLoadFinish() {
	//TODO check queue
	console.log('source load finish');
}

const resource = new Resource(sourceLoadFinish);

export default resource;


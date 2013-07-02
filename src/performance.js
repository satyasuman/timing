function getPerformance(){
	var result = {},
		performance = window.performance,
		navigation = performance.navigation,
		timing = performance.timing,
		val,
		t;

	result.timeStamp = new Date();
	result.userAgent = navigator.userAgent;
	result.URL = location.href;

	if(!window.performance){
		result.status = 'Performance interface is not defined.';
	}else{
		result.status = 'Available';

		result.isCache = (function(){
			if(navigation.type === 1){
				return false;
			}
			if(timing.requestStart === 0){
				return true;
			}
			if(timing.connectStart === timing.connectEnd){//Freifox8+,Chrome11+,IE9+
				return true;
			}
			return false;
		})();

		result.navigationType = (function (t){
			return ['normal get or link', 'reload', 'back forward', 'reserved'][t];
		})(navigation.type);

		result.redirectCount = navigation.redirectCount;
		result.redirectTime = timing.redirectEnd - timing.redirectStart + ' ( redirectStart -> redirectEnd )';
		result.domainLookupTime = timing.domainLookupEnd - timing.domainLookupStart + ' ( domainLookupStart -> domainLookuoEnd )';

		result.connectTime = timing.connectEnd - timing.connectStart + ' ( connectStart -> connectEnd )';

		result.requestTime = timing.responseStart - (timing.requestStart || timing.responseStart + 1) + ' ( requestStart -> responseStart )';

		result.responseTime = (function (){
			val = timing.responseEnd - timing.responseStart;
			if(timing.domContentLoadedEventStart){
				if(val < 0 ) {
					val = 0;
				}
			}else {
				val = 'not support';
			}
			return val + ' ( responseStart -> responseEnd )';
		})();

		result.domParsingTime = (function () {
			t = ' ( domLoading -> domInteractive )';
			return timing.domContentLoadedEventStart ? timing.domInteractive - timing.domLoading + t : 'not support' + t;
		})();

		result.resourcesLoadedTime = (function () {
			t = ' ( domLoading -> loadEventStart )';
			return timing.loadEventStart ? timing.loadEventStart - timing.domLoading + t : 'not support' + t;
		})();

		result.domContentLoadedTime = (function () {
			t = ' ( fetctStart -> domContentLoadedEventStart )';
			return timing.domContentLoadedEventStart ? timing.domContentLoadedEventStart - timing.fetchStart + t : 'not support' + t;
		})();

		result.windowLoadedTime = (function () {
			t = ' ( fetchStart -> loadEventStart )';
			return timing.loadEventStart ? timing.loadEventStart - timing.fetchStart + t : 'not support' + t;
		})();
	}
	return result;
}


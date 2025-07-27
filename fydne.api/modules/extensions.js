const clm = require('country-locale-map');

const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
const utcDate = new Intl.DateTimeFormat('en-US', {
	timeZone: 'UTC',
	hourCycle: 'h23',
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric'
});
const contry2num = require('./data/country2num.json');

module.exports = {
    validateIp: (ip) => {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
    },
    getMainCountryData: (iso) => {
        try{
            const data = clm.getCountryByAlpha2(iso);
            return {
                continent: data.continent ?? 'Europe',
                region: data.region,
                currency: data.currency ?? 'EUR',
                locale: data.default_locale ?? 'en_US',
                languages: data.languages ?? ['en'],
            };
        }catch{
            return {
                continent: 'undefined',
                region: 'undefined',
                currency: 'USD',
                locale: 'en_US',
                languages: ['en'],
            };
        }
    },
    getCountryName: (code, lang) => {
        try{
            const regionNamesLocal = new Intl.DisplayNames([lang], {type: 'region'});
            return {global: regionNames.of(code), local: regionNamesLocal.of(code)};
        }catch{
            const _result = regionNames.of(code);
            return {global: _result, local: _result};
        }
    },
    getCountryNum: (code) => {
        try{
            return contry2num[code];
        }catch{
            return '0';
        }
    },
    loc2latlon: (loc) => {
        const arr = loc.split(',');
        if(arr.length < 2) arr[1] = '0';
        return {lat: parseFloat(arr[0]), lon: parseFloat(arr[1])};
    },
    getGmtOffset: (timezone) => {
        const localDate = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hourCycle: 'h23',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        const date = Date.now();

        return diffCalculate(
            parseDate(localDate.format(date)),
            parseDate(utcDate.format(date)),
        );

        function parseDate(str) {
            return [].slice.call(/(\d+).(\d+).(\d+),?\s+(\d+).(\d+)(.(\d+))?/
            .exec(str.replace(/[\u200E\u200F]/g, '')), 1)
            .map(Math.floor);
        }
        function diffCalculate(d1, d2){
            let day = d1[1] - d2[1];
            let hour = d1[3] - d2[3];
        
            if(day > 15) day = -1;
            if(day < -15) day = 1;
        
            return (24 * day + hour);
        }
    }
};
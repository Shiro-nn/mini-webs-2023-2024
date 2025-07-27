const express = require('express');
const router = express.Router();
const ipinfo = require('ipinfo');
const mongo = require('./modules/mongo');
const exts = require('./modules/extensions');
const config = require('./config');

router.all('/', (req, res) => res.redirect('https://api-docs.'+config.domain));

//#region GeoIP Basic
router.all('/geoip', async(req, res) => {
	const ip = req.query.ip;
	getGeoipBasic(req, res, ip);
});
router.all('/geoip/basic', async(req, res) => {
	const ip = req.query.ip;
	getGeoipBasic(req, res, ip);
});
router.all('/geoip/basic/:ip', async(req, res) => {
	const ip = req.params.ip;
	getGeoipBasic(req, res, ip);
});
async function getGeoipBasic(req, res, ip){
	if(!ip) return res.status(400).json({status:'error', message: 'ip query not found'});
	if(!exts.validateIp(ip)) return res.status(400).json({status:'error', message: 'this ip-address is invalid', ip});
	if(await mongo.geoip.bogon.exists({ip})){
		return res.status(400).json({status:'error', message: 'this ip-address is bogon', ip, bogon: true});
	}

    let geoip = await mongo.geoip.basic.findOne({ip});
	if(geoip){
		res.status(200).json({
			ip: geoip.ip,
			hostname: geoip.hostname,
            anycast: geoip.anycast,
			city: geoip.city,
			region: geoip.region,
			country: geoip.country,
			loc: geoip.loc,
			org: geoip.org,
			postal: geoip.postal,
			timezone: geoip.timezone,
		});
		return;
	}

	ipinfo(ip, config.ipinfo).then(async data => {
        if(data.error != undefined) return res.status(400).json(data.error);
        if(data.bogon){
			await new mongo.geoip.bogon({ip}).save();
			return res.status(400).json({status:'error', message: 'this ip-address is bogon', ip, bogon: true});
		}

		geoip = new mongo.geoip.basic({
			ip: data.ip,
			hostname: data.hostname ?? '',
			anycast: data.anycast ?? false,
			city: data.city,
			region: data.region,
			country: data.country,
			loc: data.loc,
			org: data.org,
			postal: data.postal,
			timezone: data.timezone,
		});
		await geoip.save();

		res.status(200).json({
			ip: geoip.ip,
			hostname: geoip.hostname,
			anycast: geoip.anycast,
			city: geoip.city,
			region: geoip.region,
			country: geoip.country,
			loc: geoip.loc,
			org: geoip.org,
			postal: geoip.postal,
			timezone: geoip.timezone,
		});
	}).catch(() => res.status(400).json({status:'error', message: 'an error occurred while accessing the database'}));
}
//#endregion

//#region GeoIP full
router.all('/geoip/full', async(req, res) => {
	const ip = req.query.ip;
	getGeoipFull(req, res, ip);
});
router.all('/geoip/full/:ip', async(req, res) => {
	const ip = req.params.ip;
	getGeoipFull(req, res, ip);
});
async function getGeoipFull(req, res, ip){
	const threatDisable = req.query.threat == 'disable';

	if(!ip) return res.status(400).json({status:'error', message: 'ip query not found'});
	if(!exts.validateIp(ip)) return res.status(400).json({status:'error', message: 'this ip-address is invalid', ip});
	if(await mongo.geoip.bogon.exists({ip})){
		return res.status(400).json({status:'error', message: 'this ip-address is bogon', ip, bogon: true});
	}

    let geoip = await mongo.geoip.full.findOne({ip});
	if(geoip) return render();

	const _data = await getData();
	if(!_data){
		res.status(400).json({status:'error', message: 'an error occurred while accessing the database', ip});
		return;
	}
	
	if(_data.bogon){
		await new mongo.geoip.bogon({ip}).save();
		return res.status(400).json({status:'error', message: 'this ip-address is bogon', ip, bogon: true});
	}

	const second = threatDisable ? {threatLevel: 'undefined', threatLevelNum: 0, threatList: [], crawler: ''} : (await getSecondData());
	const countryData = exts.getMainCountryData(_data.country);
	const countryName = exts.getCountryName(_data.country, countryData.languages[0]);
	const latlon = exts.loc2latlon(_data.loc);

	geoip = new mongo.geoip.full({
		ip: ip,
		hostname: _data.hostname ?? '',
		anycast: _data.anycast ?? false,

		org: _data.org,

		threatLevel: second.threatLevel,
		threatLevelNum: second.threatLevelNum,
		threatList: second.threatList,
		crawler: second.crawler,

		city: _data.city,
		region: _data.region,
		country: _data.country,
		countryNameGlobal: countryName.global,
		countryNameLocal: countryName.local,
		continent: countryData.continent,
		continentRegion: countryData.region,

		loc: _data.loc,
		latitude: latlon.lat,
		longitude: latlon.lon,

		postal: _data.postal,
		gmtOffset: exts.getGmtOffset(_data.timezone),
		timezone: _data.timezone,

		phonePrefix: exts.getCountryNum(_data.country),
		currency: countryData.currency,
		locale: countryData.locale,
		languages: countryData.languages,

		asn: _data.asn,
		company: _data.company,
		abuse: _data.abuse,
		privacy: _data.privacy,
	});
	await geoip.save();

	render();

	if(threatDisable){
		try{
			const second2 = await getSecondData();
			geoip.threatLevel = second2.threatLevel;
			geoip.threatLevelNum = second2.threatLevelNum;
			await geoip.save();
		}catch{}
	}

	async function getData(){
		try{
			const res1 = await fetch('https://ipinfo.io/account/search?query='+ip, {
				method: 'GET',
				redirect: 'manual',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
					Cookie: 'jwt-express='+config.ipinfoToken
				}
			});
			return await res1.json();
		}catch{
			const res2 = await fetch('https://ipinfo.io/widget/demo/'+ip, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Referer': 'https://ipinfo.io/'
				}
			});
			try{
				const _data = await res2.text();
				return JSON.parse(_data).data;
			}catch(e){console.log(e);}
		}
		return null;
	}

	async function getSecondData(){
		let retData = {threatLevel: 'undefined', threatLevelNum: 0, threatList: [], crawler: ''};
		try{
			const res = await fetch('http://5.42.83.54:4326/?ip='+ip);
			const _data = await res.json();
			retData = {
				threatLevel: _data.threatLevel,
				threatLevelNum: _data.threatLevelNum,
				threatList: _data.threatList,
				crawler: _data.crawler
			};
		}catch{}
		return retData;
	}

	function render(){
		res.status(200).json({
			ip: geoip.ip,
			hostname: geoip.hostname,
            anycast: geoip.anycast,

			org: geoip.org,

			threatLevel: geoip.threatLevel,
			threatLevelNum: geoip.threatLevelNum,
			threatList: geoip.threatList,
			crawler: geoip.crawler,

			city: geoip.city,
			region: geoip.region,
			country: geoip.country,
			countryNameGlobal: geoip.countryNameGlobal,
			countryNameLocal: geoip.countryNameLocal,
			continent: geoip.continent,
			continentRegion: geoip.continentRegion,

			loc: geoip.loc,
			latitude: geoip.latitude,
			longitude: geoip.longitude,

			postal: geoip.postal,
			gmtOffset: geoip.gmtOffset,
			timezone: geoip.timezone,
			
			phonePrefix: geoip.phonePrefix,
			currency: geoip.currency,
			locale: geoip.locale,
			languages: geoip.languages,

			asn: geoip.asn,
			company: geoip.company,
			abuse: geoip.abuse,
			privacy: geoip.privacy,
		});
	}
}
//#endregion

//#region discord user info
router.all('/discord', async(req, res) => {
	const id = req.query.id;
	if(!id) return res.status(400).json({status:'error', message: 'id query not found'});
    const response = await fetch(`https://discord.com/api/v9/users/${id}`, {
        headers: {
            Authorization: 'Bot '+config.discord
        }
    })
    const json = await response.json();
    if(json.message) return res.status(400).json({status:'error', message: json.message});
    res.status(200).json({
        id: json.id,
        bot: json.bot ?? false,
        username: json.username,
        discriminator: json.discriminator,
        avatar: json.avatar,
        avatar_url: !json.avatar ? 'https://cdn.fydne.dev/another/3n0esd0kmp3h/discord.png'
            : (json.avatar.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.gif`
                : `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png`),
        banner: json.banner,
        banner_color: json.banner_color,
        banner_url: !json.banner ? null : (json.banner.startsWith('a_') ? `https://cdn.discordapp.com/banners/${json.id}/${json.banner}.gif`
            : `https://cdn.discordapp.com/banners/${json.id}/${json.banner}.png`),
        accent_color: json.accent_color,
        public_flags: json.public_flags,
    });
});
//#endregion

module.exports = router;
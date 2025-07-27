const mongoose = require("mongoose");

module.exports = {};

module.exports.geoip = {};
module.exports.geoip.bogon = mongoose.model('geoip-bogon', new mongoose.Schema({
    ip: { type: String },
}));
module.exports.geoip.basic = mongoose.model('geoip-basic', new mongoose.Schema({
    ip: { type: String },
    hostname: { type: String },
    anycast: { type: Boolean },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    loc: { type: String },
    org: { type: String },
    postal: { type: String },
    timezone: { type: String },
}));
module.exports.geoip.full = mongoose.model('geoip-full', new mongoose.Schema({
    ip: { type: String }, // ipinfo
    hostname: { type: String }, // ipinfo
    anycast: { type: Boolean }, // ipinfo

    org: { type: String }, // ipinfo

    threatLevel: { type: String }, // undefined, low, medium, high
    threatLevelNum: { type: Number }, // 0..4
    threatList: { type: Array }, // ['attack-source', 'port-scan', ...]
    crawler: { type: String }, // Googlebot/2.2

    city: { type: String }, // ipinfo
    region: { type: String }, // ipinfo
    country: { type: String }, // ipinfo
    countryNameGlobal: { type: String },
    countryNameLocal: { type: String },
    continent: { type: String },
    continentRegion: { type: String },

    loc: { type: String }, // ipinfo
    latitude: { type: Number }, // ipinfo
    longitude: { type: Number }, // ipinfo

    postal: { type: String }, // ipinfo
    gmtOffset: { type: Number },
    timezone: { type: String }, // ipinfo

    phonePrefix: { type: String },
    currency: { type: String },
    locale: { type: String },
    languages: { type: Array },

    asn: {
        type: Object,
        default: {
            asn: '',
            name: '',
            domain: '',
            route: '',
            type: '',
        }
    },

    company: {
        type: Object,
        default: {
            name: '',
            domain: '',
            type: '',
        }
    },

    abuse: {
        type: Object,
        default: {
            address: '',
            country: '',
            email: '',
            name: '',
            network: '',
            phone: '',
        }
    },

    privacy: {
        type: Object,
        default: {
            vpn: false,
            proxy: false,
            tor: false,
            relay: false,
            hosting: false,
            service: '',
        }
    },
}));
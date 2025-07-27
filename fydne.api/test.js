const HttpsProxyAgent = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const nfetch = require('node-fetch');

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));

updateIps();

async function updateIps(){
    await checkPublicProxies();

    async function parseProxies(preProxies){
        console.log(`Proxy count: ${preProxies.length}`);
        for (let i = 0; i < preProxies.length; i++) {
            const _proxy = preProxies[i];
            try{
                preGet(_proxy)
                .then(() => console.log('Finded working proxy: ' + _proxy))
                .catch(() => {});
            }catch{}
        }
    }
    
    async function preGet(proxy){
        const res = await new Promise(async res => {
            let _sended = false;
            const params = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            try{
                if(proxy.startsWith('http')){
                    const proxyAgent = new HttpsProxyAgent(proxy);
                    params.agent = proxyAgent;
                }else{
                    const proxyAgent = new SocksProxyAgent(proxy);
                    params.agent = proxyAgent;
                }
            }catch{
                res(null);
                return;
            }

            setTimeout(() => {
                if(_sended) return;
                _sended = true;
                res(null);
            }, 1000);

            nfetch('https://db-ip.com/demo/home.php?s=', params)
            .then((resp) => {
                if(_sended) return;
                _sended = true;
                res(resp);
            }).catch(() => {
                if(_sended) return;
                _sended = true;
                res(null);
            });
        });
        if(!res) throw new Error('Connection timed out');
        const _data = await res.json();
        if(!_data.demoInfo.error.startsWith('please enter a valid IP')){
            throw new Error('unknow "threatLevel"');
        }
    }

    async function checkPublicProxies(){
        let _proxyArr = [];
        try{
            const geonode = await GetResponce('https://proxylist.geonode.com/api/proxy-list?'+
            'limit=500&page=1&sort_by=upTime&sort_type=desc&filterUpTime=60&protocols=socks4');
            const _data = JSON.parse(geonode).data.sort((a, b) => a.responseTime - b.responseTime);
            for (let i = 0; i < _data.length; i++) {
                const _proxy = _data[i];
                _proxyArr.push('socks4://'+_proxy.ip+':'+_proxy.port);
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        try{
            const geonode = await GetResponce('https://proxylist.geonode.com/api/proxy-list?'+
            'limit=500&page=1&sort_by=upTime&sort_type=desc&filterUpTime=60&protocols=socks5');
            const _data = JSON.parse(geonode).data.sort((a, b) => a.responseTime - b.responseTime);
            for (let i = 0; i < _data.length; i++) {
                const _proxy = _data[i];
                _proxyArr.push('socks://'+_proxy.ip+':'+_proxy.port);
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        try{
            const geonode = await GetResponce('https://proxylist.geonode.com/api/proxy-list?'+
            'limit=500&page=1&sort_by=upTime&sort_type=desc&filterUpTime=60&protocols=http');
            const _data = JSON.parse(geonode).data.sort((a, b) => a.responseTime - b.responseTime);
            for (let i = 0; i < _data.length; i++) {
                const _proxy = _data[i];
                _proxyArr.push('http://'+_proxy.ip+':'+_proxy.port);
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];


        try{
            const spys = await GetResponce('https://spys.me/socks.txt');
            if (spys != null) {
                const arr = spys.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const str = arr[i];
                    const _proxy = str.split(' ')[0];
                    if (_proxy.includes('.') && _proxy.includes(':')) {
                        _proxyArr.push('socks://' + _proxy);
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        try{
            const spys = await GetResponce('https://spys.me/proxy.txt');
            if (spys != null) {
                const arr = spys.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const str = arr[i];
                    const _proxy = str.split(' ')[0];
                    if (_proxy.includes('.') && _proxy.includes(':')) {
                        _proxyArr.push('http://' + _proxy);
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        
        try{
            const plist = await GetResponce('https://www.proxy-list.download/api/v1/get?type=http');
            if (plist != null) {
                const arr = plist.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const _proxy = arr[i];
                    if (_proxy.includes('.') && _proxy.includes(':')) {
                        _proxyArr.push('http://'+_proxy);
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        try{
            const plist = await GetResponce('https://www.proxy-list.download/api/v1/get?type=socks4');
            if (plist != null) {
                const arr = plist.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const _proxy = arr[i];
                    if (_proxy.includes('.') && _proxy.includes(':')) {
                        _proxyArr.push('socks4://'+_proxy);
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        try{
            const plist = await GetResponce('https://www.proxy-list.download/api/v1/get?type=socks5');
            if (plist != null) {
                const arr = plist.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const _proxy = arr[i];
                    if (_proxy.includes('.') && _proxy.includes(':')) {
                        _proxyArr.push('socks://'+_proxy);
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];


        try{
            const pscan = await GetResponce('https://www.proxyscan.io/home/filterresult?status=1&' +
                'ping=&selectedType=HTTP');
            if (pscan != null) {
                const arr = pscan.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const str = arr[i];
                    const _proxy = str.split('>')[1]?.split('<')[0];
                    if (_proxy != null && _proxy != undefined && _proxy.split('.').length == 4) {
                        const port = arr[i + 1].split('>')[1]?.split('<')[0];
                        if (port != null && port != undefined) {
                            _proxyArr.push('http://' + _proxy + ':' + port);
                        }
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        try{
            const pscan = await GetResponce('https://www.proxyscan.io/home/filterresult?status=1&ping=&selectedType=SOCKS4');
            if (pscan != null) {
                const arr = pscan.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const str = arr[i];
                    const _proxy = str.split('>')[1]?.split('<')[0];
                    if (_proxy != null && _proxy != undefined && _proxy.split('.').length == 4) {
                        const port = arr[i + 1].split('>')[1]?.split('<')[0];
                        if (port != null && port != undefined) {
                            _proxyArr.push('socks4://' + _proxy + ':' + port);
                        }
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        try{
            const pscan = await GetResponce('https://www.proxyscan.io/home/filterresult?status=1&ping=&selectedType=SOCKS5');
            if (pscan != null) {
                const arr = pscan.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    const str = arr[i];
                    const _proxy = str.split('>')[1]?.split('<')[0];
                    if (_proxy != null && _proxy != undefined && _proxy.split('.').length == 4) {
                        const port = arr[i + 1].split('>')[1]?.split('<')[0];
                        if (port != null && port != undefined) {
                            _proxyArr.push('socks5://' + _proxy + ':' + port);
                        }
                    }
                }
            }
        }catch{}
        await parseProxies(_proxyArr);
        _proxyArr = [];

        async function GetResponce(url){
            const res = await fetch(url);
            return await res.text();
        }
    }
}
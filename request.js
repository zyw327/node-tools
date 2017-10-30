const net = require('net');
// const iconv = require('iconv-lite');
function request(params) {
    const client = net.connect(443, 'https//main.okgoes.com', () => {
        // console.log('connected');
        let reqHeader = 'GET / HTTP/1.1\r\n';
        reqHeader += 'Accept-Language: zh-CN,zh;q=0.8\r\n';
        reqHeader += 'Host: main.okgoes.com\r\n';
        reqHeader += 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36\r\n';
        reqHeader += 'Connection: close\r\n\r\n';
        client.write(reqHeader);
    });
    let resHeader = null;
    let resBody = '';
    let resLength = 0;
    let bodyLength = 0;
    let data = new Promise((resolve, reject) => {
        try {
            client.on('data', (data) => {
                resBody += data.toString();
                client.end();
            });
        } catch (error) {
            reject(error);
        }
    });
    data.then((data) => {
        // console.log(data);
    }).catch((error)=>{
        // console.log(error);
    });
    client.on('end', () => {
        let value = resBody.split('\r\n\r\n');
        console.log(resBody.toString());
    console.log(value.length == 3 ? value[1] : '');
        // console.log('connection is end');
    });
}

request({});
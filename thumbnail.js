const ImageOper = require('./image');

let img = new ImageOper();
img.readImage(__dirname + '/4.jpg').then((data) => {
    let ctx = img.getCtx(data.width / 10,  data.height / 10);
    ctx.rotate(180 * Math.PI / 180);
    let text = '测试类';
    ctx.fillText(text, 50, 100);
    var te = ctx.measureText(text);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.lineTo(50, 102);
    ctx.lineTo(50 + te.width, 102);
    ctx.stroke();
    ctx.drawImage(data, -(data.width / 10), -(data.height / 10), data.width / 10, data.height / 10);
    img.savePng(__dirname + '/my3.png');
}).catch((err) => {
    console.log(err);
});

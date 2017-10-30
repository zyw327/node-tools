const Canvas = require('canvas')
, Image = Canvas.Image
, fs = require('fs');

class ImageOper {
    constructor(width, height) {
        this.font = 'SimSun,宋体:style=Regular,常规';
        this.fontSize = '30px';
        this.width = 400;
        this.height = 400;
        this.canvas = null;
        this.width = width;
        this.height = height;
    }

    getCtx(width, height) {
        width = width || this.width;
        height = height || this.height;
        if (!this.canvas) {
            this.canvas = new Canvas(width, height);
        }
        let ctx = this.canvas.getContext('2d');
        ctx.font = this.fontSize + ' ' + this.font;
        return ctx;
    }

    setFont(fontName, fontSize) {
        fontSize = fontSize || this.fontSize;
        this.font = fontName;
        this.fontSize = fontSize;
        this.getCtx().font = this,fontSize + ' ' + this.font;
    }

    setFontSize (fontSize) {
        this.fontSize = fontSize;
        this.getCtx().font = this,fontSize + ' ' + this.font;
    }

    readImage(filename) {
        return new Promise((resolve, reject)=>{
            fs.readFile(filename, function(err, squid){
                if (err) return reject(err);
                let img = new Image();
                img.src = squid;
                resolve(img);
            });
        });
    }

    savePng(filename) {
       let out = fs.createWriteStream(filename)
        , stream = this.canvas.pngStream({
            bufsize: 4096 // output buffer size in bytes, default: 4096
          , quality: 100 // JPEG quality (0-100) default: 75
          , progressive: false // true for progressive compression, default: false
        });
      stream.on('data', function(chunk){
        out.write(chunk);
      });
      stream.on('end', function(){
        return true;
      });
    }

    saveJpeg(filename) {
        let out = fs.createWriteStream(filename)
            , stream = this.canvas.jpegStream({
                bufsize: 4096 // output buffer size in bytes, default: 4096
              , quality: 75 // JPEG quality (0-100) default: 75
              , progressive: false // true for progressive compression, default: false
            });
        stream.on('data', function(chunk){
            out.write(chunk);
        });
        stream.on('end', function(){
            return true;
        });
    }
}

module.exports = ImageOper;
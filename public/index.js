/**
 * Created by Zhaoxing on 2016/7/14.
 */
(function(window){
    var loiter = {
        WIDTH : window.innerWidth,        //Default container width
        HEIGHT : window.innerHeight,      //Default container height
        POINT : 17,                       //Default number of dots
        FPS : 60,                         //Default fps
        lineColor : 'rgba(0,0,0,.02)',    //Default color
        lineWidth : 1,                    //Default LineWidth
        circleColor : 'rgba(0,0,0,.05)',  //Default CircleColor
        canvas : document.getElementById('loiter'),   //Default Container
        mode : 'impact',                  //Default Collision mode option：impact | through
        circleArr : [],                   //Origin array
        context : {},                     //Canvas
        
        //Start
        start : function(options) {
            var self = this;
            if(!!options){
                self.WIDTH = options.width ? options.width : self.WIDTH;
                self.HEIGHT = options.height ? options.height : self.HEIGHT;
                self.POINT = options.num ? options.num : self.POINT;
                self.canvas = options.container ? options.container : self.canvas;
                self.FPS = options.FPS ? options.FPS : self.FPS;
                self.mode = options.mode ? options.mode : self.mode;
            }
            if(self.mode != 'impact' && self.mode != 'through'){
                self.mode = 'impact';
            }
            if(self.FPS > 1000){
                self.FPS = 1000;
            }
            self.canvas.width = self.WIDTH;
            self.canvas.height = self.HEIGHT;
            self.context = self.canvas.getContext('2d');
            self.context.strokeStyle = self.lineColor;
            self.context.strokeWidth = self.lineWidth;
            self.context.fillStyle = self.circleColor;
            if(!!options){
                self.context.fillStyle = options.circleColor ? options.circleColor : self.circleColor;
            }
            self.init();
            setInterval(function () {
                for (var i = 0; i < self.POINT; i++) {
                    var cir = self.circleArr[i];
                    cir.x += cir.moveX;
                    cir.y += cir.moveY;
                    if(self.mode == 'impact'){
                        if (cir.x > self.WIDTH - cir.r){
                            cir.x = self.WIDTH - cir.r;
                            cir.moveX = - cir.moveX;
                        }
                        else if (cir.x < cir.r){
                            cir.x = cir.r;
                            cir.moveX = - cir.moveX;
                        }
                        if (cir.y > self.HEIGHT - cir.r){
                            cir.y = self.HEIGHT - cir.r;
                            cir.moveY = - cir.moveY;
                        }
                        else if (cir.y < cir.r){
                            cir.y = cir.r;
                            cir.moveY = - cir.moveY;
                        }
                    }else if(self.mode == 'through'){
                        if (cir.x > self.WIDTH)cir.x = 0;
                        else if (cir.x < 0)cir.x = self.WIDTH;
                        if (cir.y > self.HEIGHT)cir.y = 0;
                        else if (cir.y < 0)cir.y = self.HEIGHT;
                    }
                }
                self.draw();
            },1000/self.FPS);
        },
        // 
        line : function(x, y, _x, _y, o) {
            this.beginX = x;
            this.beginY = y;
            this.closeX = _x;
            this.closeY = _y;
            this.o = o;
        },
        //原点构造函数
        circle : function(x, y, r, moveX, moveY) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.moveX = moveX;
            this.moveY = moveY;
        },
        //生成随机数
        num : function(max, _min) {
            var min = arguments[1] || 0;
            return Math.floor(Math.random()*(max-min+1)+min);
        },
        //绘制原点
        drawCircle : function(cxt, x, y, r, moveX, moveY) {
            var self = this;
            var circle = new self.circle(x, y, r, moveX, moveY);
            cxt.beginPath();
            cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI);
            cxt.closePath();
            cxt.fill();
            return circle;
        },
        //绘制线条
        drawLine : function(cxt, x, y, _x, _y, o) {
            var self = this;
            var line = new self.line(x, y, _x, _y, o);
            cxt.beginPath();
            cxt.strokeStyle = 'rgba(0,0,0,'+ o +')';
            cxt.moveTo(line.beginX, line.beginY);
            cxt.lineTo(line.closeX, line.closeY);
            cxt.closePath();
            cxt.stroke();
        },
        //初始化
        init : function() {
            var self = this;
            self.circleArr = [];
            for (var i = 0; i < self.POINT; i++) {
                self.circleArr.push(self.drawCircle(self.context, self.num(self.WIDTH), self.num(self.HEIGHT), self.num(15, 2), self.num(10, -10)/40, self.num(10, -10)/40));
            }
        },
        //重绘
        draw : function() {
            var self = this;
            self.context.clearRect(0,0,self.canvas.width, self.canvas.height);
            for (var i = 0; i < self.POINT; i++) {
                self.drawCircle(self.context, self.circleArr[i].x, self.circleArr[i].y, self.circleArr[i].r);
            }
            for (i = 0; i < self.POINT; i++) {
                for (var j = 0; j < self.POINT; j++) {
                    if (i + j < self.POINT) {
                        var A = Math.abs(self.circleArr[i+j].x - self.circleArr[i].x);
                        var B = Math.abs(self.circleArr[i+j].y - self.circleArr[i].y);
                        var lineLength = Math.sqrt(A*A + B*B);
                        var C = 1/lineLength*7-0.009;
                        var lineOpacity = C > 0.03 ? 0.03 : C;
                        if (lineOpacity > 0) {
                            self.drawLine(self.context, self.circleArr[i].x, self.circleArr[i].y, self.circleArr[i+j].x, self.circleArr[i+j].y, lineOpacity);
                        }
                    }
                }
            }
        }
    };
    window.loiter = loiter;
})(window);
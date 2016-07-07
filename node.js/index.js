var raspi = require('raspi');
var Serial = require('raspi-serial').Serial;
var HMC5883L = require('compass-hmc5883l');
var compass = new HMC5883L(1);

var io = require('socket.io').listen(8000);

//var I2C = require('raspi-i2c').I2C;
//var i2c = new I2C();

var serial;

//io.set('log level', 1);


io.sockets.on('connection', function (socket) {
	//console.log('connected');
   socket.on('servo', function (msg) {
       //console.log(msg);
	     serial.open(() => {
           serial.write(msg);
	
    });
  });
	   
   
   socket.on('disconnect', function () {
      // console.log('disconnected');
   //io.sockets.disconnect();   ?????????
  // io.sockets.close();
   });
});

raspi.init(function() {
  serial = new Serial({baudRate: 115200, dataBits: 8, stopBits: 1, parity: 'none' });
  var readData = ''; 

  serial.open(() => {
    serial.on('data', function(data) {
     readData += data.toString();
     io.sockets.emit('tele_a_data', readData);
     //process.stdout.write(readData);
     readData = '';

    });
  });
  
});


setInterval(function(){
	try{
	    compass.getHeadingDegrees('x', 'y', function (err, heading) {
           
		    if(typeof heading != 'undefined' )
		    {
		     var heading_fixed = heading.toFixed(2);
		     io.sockets.emit('tele_r_data', heading_fixed);
		      
		    }
              });   
			//  compass.getRawValues(function (err, vals) {
   // console.log(vals);});
	 
	} catch(err){  //console.log(err); 
	}
	
}, 100);  
const request = require('request')
var http = require('http')
var fs = require('fs');
var formidable = require('formidable');


http.createServer(function (req, res) {
  if (req.url == '/upload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filen.path;
      var id = Math.floor(Math.random() * 100000)
      var newpath = 'C:/Users/codet/Desktop/Tiger/Programming/Project/metrohacks heart/' + id + ".wav";
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        return res.write('<script>window.location.href = "http://localhost:8080/analysis?'+id+'";</script>');
        res.end();
      });
 });
  }else if(req.url.substring(0,9) == '/analysis') {
  	res.writeHead(200, {'Content-Type': 'text/html'});
  	var nid = req.url.split('?')[1];
  	var pred;
  	res.write('<html>');
		res.write('<body style="background-color: rgb(30,70,190);padding-top: 280px;padding-left: 40%;">');
			res.write('<p style="font-family: Arial;font-size: 50px;color: #FFFFFF">ANALYZING....</p>');
		res.write('</body>');

	res.write('</html>');

  	request.post('http://localhost:8089', {
  		json: {
    		fname: nid + ".wav"
  		}
	}, (error, re, body) => {
  		if (error) {
    		console.error(error)
    		return;
  		}
  		return res.write('<script>window.location.href = "http://localhost:8080/result,' + body["a"] + ',' + body["b"] + ',' + body["c"] + '";</script>');
        res.end();
	})
  }else if(req.url.substring(0,7) == '/result') {
  	res.writeHead(200, {'Content-Type': 'text/html'});
  	var re = req.url.split(",");
  	var a = re[1];
  	var b = re[2];
  	var c = re[3];
  	var what;
  	if(a >= b && a >= c) what = "ARTIFACT";
  	if(b >= a && b >= c) what = "NORMAL";
  	if(c >= a && c >= b) what = "MURMUR";
  	
  	res.write('<html>') 
res.write('<head>' )
res.write('	<title>HEART SOUND RESULTS</title>' )
res.write('	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.js"></script>' )
res.write('</head>' )
res.write('<body style="background-color: rgb(30,70,190);">' )
res.write('	<div class="main" style="width: 100%; text-align: center;margin-top: 100px">' )
res.write('		<p style="font-size:30px;font-family: Arial;font-weight:700;color: #FFFFFF" >WE ARE ' + Math.floor(Math.max(a,b,c) * 1000) / 10 +'% CONFIDENT THAT YOUR HEART BEAT IS</p>' )
res.write('		<p style="font-size: 50px;font-family: Arial;font-weight:700;color: #FFFF00">' + what + '</p>' )
res.write('		<div style="text-align: center">' )
res.write('		<canvas id="myChart" width="400px" height="400px" style="text-align: center;margin-left: 590px"></canvas>' )
res.write('	</div>' )
res.write('		<script>') 
res.write('var ctx = document.getElementById("myChart").getContext("2d");' )
res.write('var myChart = new Chart(ctx, {' )
res.write('    	type: "bar",' )
res.write('    	data: {' )
res.write('        	labels: ["ARTIFACT", "NORMAL", "MURMUR"],' )
res.write('        	datasets: [{' )
res.write('            	label: "Percentage of Confidence",' )
res.write('            	data: ['+ a + ', ' + b + ', ' + c + '],' )
res.write('            	backgroundColor: [' ) 
res.write('                	"rgba(255, 99, 132, 0.6)",' )
res.write('                	"rgba(54, 162, 235, 0.6)",' )
res.write('                	"rgba(255, 206, 86, 0.6)",' )
res.write('            	],' )
res.write('            	borderColor: [' )
res.write('                	"rgba(255, 99, 132, 1)",' )
res.write('                	"rgba(54, 162, 235, 1)",' )
res.write('                	"rgba(255, 206, 86, 1)",' )
res.write('            	],' )
res.write('            	borderWidth: 1' )
res.write('        	}]' )
res.write('    	},' )
res.write('    	options: {' ) 
res.write('        	scales: {' ) 
res.write('            	yAxes: [{' ) 
res.write('                	ticks: {' ) 
res.write('                    	beginAtZero: true' )
res.write('                	}' )
res.write('            	}]' )
res.write('        	}' )
res.write('    	}' )
res.write('	});' )
res.write('ctx.canvas.parentNode.style.height = "300px";' )
res.write('ctx.canvas.parentNode.style.width = "300px";' )
res.write('	</script>' )
res.write('	</div>' )
res.write('</body>' )
res.write('</html>' )



  	res.end();


  } else {
    fs.readFile('home.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
  }
}).listen(8080);




// request.post('http://localhost:8089', {
//   json: {
//     fname: "normal__201105011626.wav"
//   }
// }, (error, res, body) => {
//   if (error) {
//     console.error(error)
//     return
//   }
// })
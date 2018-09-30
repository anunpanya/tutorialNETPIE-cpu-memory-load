#!/usr/bin/env node

var os = require("os"),
    cpus = os.cpus(),
    MicroGear = require('microgear');

const APPKEY    = "<APPKEY>";
const APPSECRET = "<APPSECRET>";
const APPID     = "<APPID>";

var microgear = MicroGear.create({
    gearkey : APPKEY,
    gearsecret : APPSECRET
});

microgear.on('connected', function() {
    console.log('Connected...');
    microgear.setname("name");

    setInterval(function(){
        var user=0,nice=0,sys=0,idle=0,counter=0;
		var loadavg = os.loadavg(1);
		var freemem = os.freemem();
        var totalmem = os.totalmem();

        for(var i = 0, len = cpus.length; i < len; i++) {
            var cpu = cpus[i], total = 0;
            for(type in cpu.times)
                total += cpu.times[type];
            user+=(100 * cpu.times.user / total);
            nice+=(100 * cpu.times.nice / total);
            sys+=(100 * cpu.times.sys / total);
            idle+=(100 * cpu.times.idle / total);
            counter++;
        }
	
		// Chat to HTML5 : user, nice, system, idle, cpuload, totalmemory, freememory, memoryload
		microgear.chat("name",(user/counter).toFixed(2)+','+(nice/counter).toFixed(2)+','+(sys/counter).toFixed(2)+','+(idle/counter).toFixed(2)+','+parseFloat(loadavg).toFixed(2)+','+totalmem+','+freemem+','+((1-(freemem/totalmem))*100).toFixed(2));
    },1000);
});

microgear.on('message', function(topic,body) {
    console.log('incoming : '+topic+' : '+body);
});

microgear.on('closed', function() {
    console.log('Closed...');
});

microgear.connect(APPID);

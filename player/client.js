const ws = new WebSocket('ws://localhost:3000');


ws.onopen = function(){
	console.log("online")
}
ws.onoclose = function(){
	console.log("offline")
}
ws.onmessage = function(){
	console.log("message")
}
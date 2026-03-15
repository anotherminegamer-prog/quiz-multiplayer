const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};
let scores = {};
let gameStarted = false;

io.on("connection",(socket)=>{

    socket.on("join",(name)=>{
        players[socket.id]=name;
        scores[name]=0;
        io.emit("lobby",Object.values(players));
    });

    socket.on("startGame",()=>{
        gameStarted=true;
        io.emit("gameStarted");
    });

    socket.on("answer",(data)=>{
        if(data.answer===1){
            scores[players[socket.id]]++;
        }
        io.emit("scores",scores);
    });

    socket.on("disconnect",()=>{
        delete scores[players[socket.id]];
        delete players[socket.id];
        io.emit("lobby",Object.values(players));
    });

});

http.listen(3000,()=>{
    console.log("Servidor rodando");
});
const { Router } = require("express");
const route = Router();
const folder = require("../modules/folder");
const user = require("../modules/user");
const file = require("../modules/file");

route.get("/api/status",(req,res,next)=>{
    try {
        user.find({ "password": { $ne: null } },function(err,found){
            res.send(found.length == 1);
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

route.post("/api/setpin/:pin",async(req,res,next)=>{
    try {
        const newPin = req.params.pin;
        if(!newPin){
            res.status(400).send("Bad request");
            return;
        }

        user.find({ "password": { $ne: null } },async function(err,found){
            if(found && found.length > 0){
                found[0].updateOne({password: newPin}, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        res.send("password changed");
                    }
                });

            } else {
                await user.create({password: newPin});
                res.send("password set");
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
})

route.get("/api/verify/:pin",(req,res,next)=>{
    try {
        const enteredPin = req.params.pin;
        user.find({ "password": { $ne: null } },async function(err,found){
            if(found[0].password == enteredPin){
                res.send(true);
            } else {
                res.send(false);
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
});

route.post("/api/createfolder/:folderName", async(req,res,next)=>{
    try {
        const folderName = req.params.folderName;
        if(!folderName){
            return;
        }
        folder.findOne({name: folderName},async(err,found)=>{
            if(found){
                res.send(false);
                return;
            } else {
                await folder.create({name: folderName});
                res.send(true);
            }
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
});

route.get("/api/getfolders",async(req,res,next)=>{
    try {
        folder.find({},async(err,found)=>{
            if(err){
                console.log(err);
                return;
            }
            res.send(found);
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
});

route.get("/api/getfiles/:folderName",async(req,res,next)=>{
    try {
        const folderName = req.params.folderName;
        if(!folderName){
            return;
        }
        file.find({folder: folderName},(err,found)=>{
            if(err){
                console.log(err);
                return;
            }
            res.send(found);
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
})

route.post("/api/createfile",async(req,res,next)=>{
    try {
        const folderName = req.query.folderName;
        const fileName = req.query.fileName;
        const newContent = req.query.content;

        if(!folderName || !fileName || !newContent){
            res.send(false);
            return;
        }


        file.findOne({name: fileName, folder: folderName },async(err,found)=>{
            if(err){
                console.log(err);
                return;
            }
            if(found){
                found.updateOne({content: newContent},(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                });
                res.send(true);
                return;
            }
            await file.create({name: fileName, folder: folderName, content: newContent});
            res.send(true);
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = route ;


const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const cors=require('cors')
const path=require('path')
const multer  = require('multer')
const fs = require('fs');
const exec = require('child_process').execFile
const shortid = require('shortid');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'input/')
    },
    filename:(req,file,cb)=>{
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9)+file.originalname.toLowerCase().split(' ').join('-');
        cb(null,fileName)
    }
})

const upload = multer({storage})

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.post('/upload',upload.single('file'),(req,res)=>{
    let id=shortid.generate();
    if(req.file.mimetype!=='image/bmp'){
        return res.json({success:0})
    }else{
        exec('main.exe',[`./input/${req.file.filename}`,req.body.value,`./output/${id}.bmp`],(err,data)=>{
            if(err){
                console.log(err)
                return res.json({success:0})
            }
            fs.unlinkSync(`input/${req.file.filename}`)
            return res.json({success:1,url:`http://localhost:5000/view/${id}`})
        })
    }
})

app.get('/view/:id',(req,res)=>{
    let readStream=fs.createReadStream(`./output/${req.params.id}.bmp`)
    readStream.pipe(res)
    fs.unlinkSync(`./output/${req.params.id}.bmp`)
})

app.use(express.static('client/build'))
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','build','index.html'))
})

app.listen(process.env.PORT||5000);
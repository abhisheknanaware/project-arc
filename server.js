const express=require('express')
const path=require('path')
const fs=require('fs');
const { json } = require('stream/consumers');
const app=express();
port=3000
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/',(req,res,next)=>{
    res.render('index');
    
})
app.get('/aboutus',(req,res,next)=>{
    res.render('aboutus');
})
app.get('/Contactus',(req,res,next)=>{
    res.render('Contactus');
})
app.get('/login',(req,res,next)=>{
    res.render('login');
})

app.post('/login',(req,res,next)=>{
    const reqbody=req.body

    fs.appendFile('userlogin.txt',JSON.stringify(reqbody,null,2)+'\n',(err)=>{
        if(err)throw err;
        console.log("data is written in the file");
        res.redirect('/')
    })
})

app.post('/Contactus',(req,res,next)=>{
    const reqbody=req.body
    fs.appendFile('usercontatct.txt',JSON.stringify(reqbody,null,2)+'\n',(err)=>{
        if(err)throw err;
        console.log("data is written in the file");
        res.redirect('/Contactus')
    })
})


app.listen(port,()=>{
    console.log(`server is running at: http://localhost:${port}`)
})
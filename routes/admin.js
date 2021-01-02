const { response } = require('express');
var express = require('express');
const { render } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();


//productHelper
var productHelper=require('../helpers/product-helpers')
 

//midleware
const verifyLogin=(req,res,next)=>{
  if(req.session.adloggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}


 //GET users listing. */
 router.get('/', function(req, res, next) {

   let admin=req.session.admin
   if(req.session.adloggedIn){
    productHelpers.getAllProducts().then((products)=>{
      console.log(products);
      res.render('admin/view-products',{admin:true,products,admin})
   })

  }else{
    res.render('admin/admin-login',{"loginErr":req.session.logginErr})
    req.session.logginErr=false
  }
    
  
  
 });


//admin  signup

router.get('/login',(req,res,next)=>{

  
  if(req.session.adloggedIn){
    res.render('admin/login-display',{admin:true})

  }else{
    res.render('admin/admin-login',{"loginErr":req.session.logginErr})
    req.session.logginErr=false
  }
    



})
 


router.get('/signup',function(req,res){
  res.render('admin/admin-signup')
})

router.get('/view-products', function(req, res, next) {

  let admin=req.session.admin
  

  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products',{admin:true,products,admin})
  })
  
});


router.post('/signup',(req,res)=>{
  productHelper.adminSignup(req.body).then((response)=>{
    console.log(response);
    req.session.adloggedIn=true
    req.session.admin=response
    res.render('admin/admin-login')
  })
})




//admin login

router.post('/login',(req,res)=>{
  let admin=req.session.admin
  productHelper.adminLogin(req.body).then((response)=>{
   
    if(response.status){
      req.session.adloggedIn=true
      
      req.session.admin=response.admin
      res.render('admin/login-display',{admin:true,admin})
      
    }else{
      req.session.logginErr="Invalid username or password"
      res.redirect('/admin/')
    }
  })
})


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

//staff login



//staff signup page
router.get('/staff-signuppage',function(req,res,next){
  let admin=req.session.admin
  res.render('admin/staff-signuppage',{admin:true,admin})
})

router.post('/staff-signup',(req,res)=>{
  productHelper.staffSignup(req.body).then((response)=>{
    console.log(response);
    req.session.adloggedIn=true
    req.session.staff=response
    res.render('admin/staff-login')
  })
})



//admin/add-products router
router.get('/add-prodcts',function(req,res,next){
  
  let admin=req.session.admin
  res.render('admin/add-prodct',{admin:true,admin})
})

router.post('/add-product',(req,res)=>{
  let admin=req.session.admin
  console.log(req.body);
  console.log(req.files)
  productHelper.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render("admin/add-prodct",{admin:true,admin})
      }else{
        console.log(err);
      }
    })
    
  })
  
  
})

router.get('/delete-product/:id', (req,res)=>{
  
 let proId=req.params.id
 console.log(proId);
 productHelpers.deleteProduct(proId).then((response)=>{
  
   res.redirect('/admin/')
 })
})

router.get('/edit-product/:id',async(req,res)=>{

  let admin=req.session.admin

  let product= await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product,admin:true,admin})
})


router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let id=req.params.id
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
}),

router.get('/view-message', function(req, res, next) {
  let admin=req.session.admin
  let message=req.session.message
  

  productHelpers.getMessage().then((message)=>{
    console.log(message);
    res.render('admin/show-message',{admin:true,message,admin})
  })
  
});



router.get('/give-price', function(req, res, next) {
  
  let admin=req.session.admin
    
   
  productHelpers.getPricedetails().then((pricedetails)=>{
    console.log(pricedetails);
    res.render('admin/give-price',{admin:true,pricedetails,admin})
  })
  
});


router.get('/delete-message/:id', (req,res)=>{
  
  let msgId=req.params.id
  console.log(msgId);
  productHelpers.deleteMessage(msgId).then((response)=>{
   


    productHelpers.getMessage().then((message)=>{
      console.log(message);
      res.render('admin/show-message',{admin:true,message})
    })

    
  })
 }),


 
router.get('/delete-price/:id', (req,res)=>{
  
  let priceId=req.params.id
  
  productHelpers.deletePrice(priceId).then((response)=>{
   
      
   
  productHelpers.getPricedetails().then((pricedetails)=>{
    
    res.render('admin/give-price',{admin:true,pricedetails})
    })

    
  })
 })



 router.get('/adcert',function(req,res,next){
  
  let admin=req.session.admin
  res.render('admin/adcert',{admin:true,admin})
})



router.post('/adcert',(req,res)=>{
  let admin=req.session.admin
 
  productHelper.addcert(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render("admin/adcert",{admin:true,admin})
      }else{
        console.log(err);
      }
    })
    
  })
  
  
})




 //GET users listing. */
 router.get('/vcert', function(req, res, next) {

  let admin=req.session.admin
  if(req.session.adloggedIn){
   productHelpers.getcert().then((cert)=>{
     
     res.render('admin/vcert',{admin:true,cert,admin})
  })

 }else{
   res.render('admin/admin-login',{"loginErr":req.session.logginErr})
   req.session.logginErr=false
 }
   
 
 
});



router.get('/delete-cert/:id', (req,res)=>{
  
  let cerId=req.params.id
  console.log(cerId);
  productHelpers.deletecert(cerId).then((response)=>{
   
    res.redirect('/admin/vcert')
  })
 })
module.exports = router;


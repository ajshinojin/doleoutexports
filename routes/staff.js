const { response } = require('express');
var express = require('express');
const { render } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

//productHelper
var productHelper=require('../helpers/product-helpers')
 

//midleware
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}


 //GET users listing. */
 router.get('/', function(req, res, next) {

   let staff=req.session.staff
   if(req.session.loggedIn){
    productHelpers.getAllProducts().then((products)=>{
      console.log(products);
      res.render('staff/view-products',{staff:true,products,staff})
   })

  }else{
    res.render('admin/staff-login',{"loginErr":req.session.logginErr})
    req.session.logginErr=false
  }
    
  
  
 });


//admin  signup









//admin login



router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

//staff login

router.get('/staff-login',(req,res,next)=>{
 
  if(req.session.loggedIn){
    res.render('admin/staff-display',{staff:true})

  }else{
    res.render('admin/staff-login',{"loginErr":req.session.logginErr})
    req.session.logginErr=false
  }
  

})


router.post('/staff-login',(req,res)=>{

  
  productHelper.staffLogin(req.body).then((response)=>{
    let staff=req.session.staff
    if(response.status){
      req.session.loggedIn=true
      req.session.staff=response.staff
      res.render('admin/staff-display',{staff:true,staff})
    }else{
      req.session.logginErr="Invalid username or password"
      res.redirect('/staff/')
    }
  })
})
 





//admin/add-products router
router.get('/add-prodcts',function(req,res,next){
  
  let staff=req.session.staff
  res.render('staff/add-prodct',{staff:true,staff})
})

router.post('/add-product',(req,res)=>{
  let staff=req.session.staff
  console.log(req.body);
  console.log(req.files)
  productHelper.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render("staff/add-prodct",{staff:true,staff})
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
  
   res.redirect('/staff/')
 })
})

router.get('/edit-product/:id',async(req,res)=>{

  let staff=req.session.staff

  let product= await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('staff/edit-product',{product,staff:true,staff})
})


router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/staff')
    if(req.files.Image){
      let id=req.params.id
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})



router.get('/view-message', function(req, res, next) {
  let staff=req.session.staff
  let message=req.session.message
  

  productHelpers.getMessage().then((message)=>{
    console.log(message);
    res.render('staff/staffshow-message',{staff:true,message,staff})
  })
  
});



router.get('/delete-message/:id', (req,res)=>{
  
  let msgId=req.params.id
  console.log(msgId);
  productHelpers.deleteMessage(msgId).then((response)=>{
   


    productHelpers.getMessage().then((message)=>{
      console.log(message);
      res.render('admin/show-message',{staff:true,message})
    })

    
  })
 }),





router.get('/give-price', function(req, res, next) {
  
  let staff=req.session.staff
    
   
  productHelpers.getPricedetails().then((pricedetails)=>{
    console.log(pricedetails);
    res.render('staff/give-price',{staff:true,pricedetails,staff})
  })
  
});

module.exports = router;


const { response } = require('express');
var express = require('express');
var router = express.Router();

const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers')

//middgleware
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user=req.session.user
 

  console.log(user);

//cartcount
   let cartCount=null
   if(req.session.user){

   cartCount= await userHelpers.getCartCount(req.session.user._id)
   }


  productHelpers.getAllProducts().then((products)=>{
    
    res.render('user/view-products',{admin:false,products,user,cartCount})
  })
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')

  }else{

  res.render('user/login',{"loginErr":req.session.logginErr})
  req.session.logginErr=false
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response
    res.render('user/login')
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.logginErr="Invalid username or password"
      res.redirect('/login')
    }
  })
})


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})


router.get( '/cart', verifyLogin,async(req,res,)=>{
  let products= await userHelpers.getCartProducts(req.session.user._id)
  console.log(products);
  res.render('user/cart',{products,user:req.session.user})
})

//add cart

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  console.log("api call");
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})

//ajax
router.post('/change-product-quantity',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then((response)=>{
    res.json(response)
    
  })
})

router.get('/place-order', verifyLogin,async(req,res)=>{
  let total=await userHelpers.getTotalAmount(req.session.user._id)
  console.log(total);
  res.render('user/place-order')
})



router.post('/send-message',(req,res)=>{
  let usermsg=req.session.usermsg
  console.log(req.body);
  console.log(req.files)
  userHelpers.userMsg(req.body,(id)=>{
    res.redirect('/')
    
    
  })
  
  
})




router.get( '/ask-price', verifyLogin,async(req,res,)=>{
  let products= await userHelpers.getCartProducts(req.session.user._id)
  console.log(products);
  res.render('user/ask-price',{products,user:req.session.user})
})



router.post('/send',(req,res)=>{
  let pricedetails=req.session.pricedetails
  console.log(req.body);
  console.log(req.files)
  userHelpers.PriceDetails(req.body,(id)=>{
    res.redirect('/')

    
    
    
  })
  
  
})




router.post('/delete-cart', (req,res,next)=>{
  
 
  
  userHelpers.deleteCart(req.body).then((response)=>{
    
    res.json(response)
  })
 })





router.get('/vcert', async function(req, res, next) {
  let user=req.session.user
 

 

//cartcount
  
   if(req.session.user){

   
   


  productHelpers.getcert().then((cert)=>{
    
    res.render('user/vcert',{admin:false,cert,user})
  })
}else{

  res.render('user/login',{"loginErr":req.session.logginErr})
  req.session.logginErr=false
  }
});
module.exports = router;

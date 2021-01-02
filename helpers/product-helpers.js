
var db=require('../config/connection')
var collection=require('../config/collections');
const { response } = require('express');
const bcrypt=require('bcrypt')


var express = require('express');
const { render } = require('../app');
var router = express.Router();

var productHelper=require('../helpers/product-helpers');
const { LoopDetected } = require('http-errors');
const { Logger } = require('mongodb');

//delete product
var objectId=require('mongodb').ObjectID



//admin login

//add product
module.exports={
   
    adminLogin:(adminData)=>{

        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
            if(admin){

                bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.admin=admin
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })

            }else{
                console.log('login failed');
                resolve({status:false})
            }

        })
    },

   
   
   
   
   
    addProduct:(product,callback)=>{
        console.log(product);
        db.get( ).collection('product').insertOne(product).then((data)=>{

           
            callback(data.ops[0]._id)
        })
    },

   
    //get files from data base
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },


    //delete product
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            console.log(prodId);
            console.log(objectId(prodId))
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(prodId)}).then((response)=>{
               // console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    },

    adminSignup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.Password=await bcrypt.hash(adminData.Password,10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                resolve(data.ops[0])
            })
            
        })
        
    
        },

        //staff signup
        staffSignup:(staffData)=>{
            return new Promise(async(resolve,reject)=>{
                staffData.Password=await bcrypt.hash(staffData.Password,10)
                db.get().collection(collection.STAFF_COLLECTION).insertOne(staffData).then((data)=>{
                    resolve(data.ops[0])
                })
                
            })
            
        
            },


            //staff login

            staffLogin:(staffData)=>{

                return new Promise(async(resolve,reject)=>{
                    let loginStatus=false
                    let response={}
                    let staff=await db.get().collection(collection.STAFF_COLLECTION).findOne({Email:staffData.Email})
                    if(staff){
        
                        bcrypt.compare(staffData.Password,staff.Password).then((status)=>{
                            if(status){
                                console.log("login success");
                                response.staff=staff
                                response.status=true
                                resolve(response)
                            }else{
                                console.log('login failed')
                                resolve({status:false})
                            }
                        })
        
                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
        
                })
            },

            getMessage:()=>{
                return new Promise(async(resolve,reject)=>{
                    let message=await db.get().collection(collection.MESSAGE_COLLECTION).find().toArray()
                    resolve(message)
                })
            },
           
    
        
    getPricedetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let pricedetails=await db.get().collection(collection.PRICEDETAILS_COLLECTION).find().toArray()
            
            resolve(pricedetails)
        })
    },


    deleteMessage:(msgId)=>{
        return new Promise((resolve,reject)=>{
            
            console.log(objectId(msgId))
            db.get().collection(collection.MESSAGE_COLLECTION).removeOne({_id:objectId(msgId)}).then((response)=>{
               // console.log(response);
                resolve(response)
            })
        })
    },

    

    deletePrice:(priceId)=>{
        return new Promise((resolve,reject)=>{
            
            console.log(objectId(priceId))
            db.get().collection(collection.PRICEDETAILS_COLLECTION).removeOne({_id:objectId(priceId)}).then((response)=>{
               // console.log(response);
                resolve(response)
            })
        })
    },

    
      
   
    addcert:(cert,callback)=>{
        
        db.get( ).collection('cert').insertOne(cert).then((data)=>{

           
            callback(data.ops[0]._id)
        })
    },
      

    getcert:()=>{
        return new Promise(async(resolve,reject)=>{
            let cert=await db.get().collection(collection.CERT_COLLECTION).find().toArray()
            resolve(cert)
        })
    },
    



    deletecert:(cerId)=>{
        return new Promise((resolve,reject)=>{
            
            
            db.get().collection(collection.CERT_COLLECTION).removeOne({_id:objectId(cerId)}).then((response)=>{
               // console.log(response);
                resolve(response)
            })
        })
    },
}
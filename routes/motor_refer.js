var Joi = require('@hapi/joi');
var express = require('express');
var jwt = require('jsonwebtoken')
var router = express.Router();
var db = require('./db');

//

//SECRET FOR JSON WEB TOKEN
let secretKey = 'motor_secret_key';
let jwtExpirySeconds = 21600 ; 

/* CREATE TOKEN FOR USE */
router.post('/login', function (req, res) {
      //Check Parameter
    let schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    let { error } =  Joi.validate(req.body, schema);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let {username, password} = req.body;
    //console.log(username) ;
    //console.log(password) ;
    // Fixed user เอาไว้ก่อน
    let userLogin = {
        "username": username ,
        "role": "admin"
    }
    //let token = jwt.sign(userLogin, secretKey, { expiresIn: jwtExpirySeconds})
    let token = jwt.sign(userLogin, secretKey, { expiresIn: "6h"})
    res.json({jwt: token}) ;
});


function isAuthorization (req, res, next)  {
    let authorization =  req.headers.authorization  // ดึงข้อมูล authorization ใน header
   //let authorization =  req.headers['authorization'] ;
    console.log(authorization) ;
    if( typeof authorization !== "undefined") {
        let token = req.headers['authorization'].split(' ')[1]
        console.log(token) ;
        try{
            jwt.verify(token, secretKey );
          }catch (err){
            return res.status(401).send({auth: false, message: 'Invalid token or token expired '});
          }
          //let decoded = jwt.decode(token, {complete: true});
          //console.log(decoded.header);
          //console.log(decoded.payload)
          next() ;
    } else {
        return res.status(400).send({auth: false, message: 'No token provided'});
    }
}

// Get Data from Mysql database 
router.get('/ListInsurance_profile' , isAuthorization , function (req, res) {
    let sql = 'select INS_COMP_CODE , INS_COMP_NAME_T from tblr_insurance_profile'  // คำสั่ง sql
    let query = db.query(sql, (err, results, fields) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        res.send(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
});

router.get('/ListProvince', isAuthorization , function (req, res) {
    let sql = 'select PROVINCE_CODE , PROV_NAME_T from tblr_province'  // คำสั่ง sql
    let query = db.query(sql, (err, results, fields) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        res.send(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
});

router.get('/GetProvince', function (req, res) {
    //Check Parameter
    let schema = Joi.object().keys({
        province_code: Joi.string().length(2).required()
    });

    let { error } =  Joi.validate(req.body, schema);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // End Check Parameter
    let sql = "select * from tblr_province where province_code = '" + req.body.province_code  + "'"  // คำสั่ง sql
    let query = db.query(sql, (err, results, fields) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        res.send(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
});

router.get('/ListDistrict', function (req, res) {
    //Check Parameter http://localhost:3000/api/ListDistrict?province_code=01
    let schema = Joi.object().keys({ 
        province_code: Joi.string().length(2).required()
    });

    let { error } =  Joi.validate(req.query, schema);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // End Check Query Parameter
    let sql = "select DISTRICT_CODE , DISTRICT_NAME_T from tblr_district where province_code = '" + req.query.province_code  + "'" // คำสั่ง sql
    //res.send(sql) ;
    let query = db.query(sql, (err, results, fields) => { // สั่ง Query คำสั่ง sql
        if (err) throw err + sql   // ดัก error
        res.send(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
});

router.get('/GetDistrict', function (req, res) {
    //Check Parameter
    let schema = Joi.object().keys({
        province_code: Joi.string().length(2).required(),
        district_code: Joi.string().length(2).required()
    });

    let { error } =  Joi.validate(req.body, schema);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    // End Check Parameter
    let sql = "  select * from tblr_district"
        sql += " where province_code = '" + req.body.province_code  + "'" 
        sql += " and district_code = '" + req.body.district_code  + "'" 
    let query = db.query(sql, (err, results, fields) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        res.send(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
});


module.exports = router;
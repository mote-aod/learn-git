var Joi = require('@hapi/joi');
var express = require('express');
var router = express.Router();
var db = require('./db');

// Get Data from Mysql database 
router.get('/api/listCountry', function (req, res) {
    let sql = 'SELECT CODE , NAME FROM COUNTRY'  // คำสั่ง sql
    let query = db.query(sql,(err,results,fields) => { // สั่ง Query คำสั่ง sql
        if(err) throw err  // ดัก error
        //console.log(results) // แสดงผล บน Console 
        //console.log(fields) // แสดงผล บน Console 
        res.send(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
        })
});

router.get('/api/getCountry/:code', function (req, res) {
    let sql = "SELECT CODE , NAME FROM COUNTRY WHERE CODE = '" + req.params.code.toUpperCase() + "'"  // คำสั่ง sql
    let query = db.query(sql,(err,results) => { // สั่ง Query คำสั่ง sql
        if(err) throw err  // ดัก error
        res.send(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
        })
});

router.get('/api/list/department', function (req, res) {
    let sql = 'SELECT * FROM department'  // คำสั่ง sql
    let query = db.query(sql,(err,results,fields) => { // สั่ง Query คำสั่ง sql
        if(err) throw err  // ดัก error
        let numRows = results.length;
        if (numRows == 0) { // กรณีไม่มีข้อมูล
            res.send(results) ;
            // res.json({
            //     "status": "fail",
            //     "message": "No have data department" ,
            //     "numrows": numRows.toString()
            // })
        } else {
            res.send(results) ;
        }
        })
});

router.post('/api/insert/department', function (req, res) {

    let { error } = validateDepartment(req.body) ; // result.error
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
  
    let sql = "INSERT INTO department (dept_code , dept_name ) VALUES (" ;
        sql += "'" + req.body.dept_code + "' ," ;
        sql += "'" + req.body.dept_name + "')" ;

    let query = db.query(sql, (err,results) => { // สั่ง Query คำสั่ง sql
         if(err) return res.status(500).json({
             "status": "fail",
             "message": err.sqlMessage.toString() // error.sqlMessage
         })
        res.json({
            "status": "success",
            "message": "Insert department success" // error.sqlMessage
        })
     })
  
});

router.post('/api/update/department', function (req, res) {

    let { error } = validateDepartment(req.body) ; // result.error
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
  
    let sql = "UPDATE department SET "  ;
        sql += "dept_name = '" + req.body.dept_name + "'" ;
        sql += "WHERE dept_code ='" + req.body.dept_code + "' " ;

        query = db.query(sql,(err, results) => { // สั่ง Query คำสั่ง sql
            if (err) return res.status(500).json({
                "status": "fail",
                "message": err.sqlMessage.toString() // error.sqlMessage
            })
            let numRows = results.affectedRows;
            if (numRows == 0) { // กรณีไม่มีข้อมูล
                res.json({
                    "status": "fail",
                    "message": "No have data department dept_code = " + req.body.dept_code ,
                    "numrows": numRows.toString()
                })
            } else {
                res.json({
                    "status": "success",
                    "message": "Update department dept_code = " + req.body.dept_code + " success",
                    "numrows": numRows.toString()
                })
            }
        })
  
});

router.delete('/api/delete/department', function (req, res) {

     let schema = Joi.object().keys({
         dept_code: Joi.string().length(3).required()
     });

     let { error } =  Joi.validate(req.body, schema);
     if (error) {
         res.status(400).send(error.details[0].message);
         return;
     }

    sql = "DELETE FROM department WHERE dept_code = ? " ;
    query = db.query(sql, req.body.dept_code ,(err, results) => { // สั่ง Query คำสั่ง sql
        if (err) return res.status(500).json({
            "status": "fail",
            "message": err.sqlMessage.toString() // error.sqlMessage
        })
        let numRows = results.affectedRows;
        if (numRows == 0) { // กรณีไม่มีข้อมูล
            res.json({
                "status": "fail",
                "message": "No have data department dept_code = " + req.body.dept_code ,
                "numrows": numRows.toString()
            })
        } else {
            res.json({
                "status": "success",
                "message": "Delete department dept_code = " + req.body.dept_code + " success",
                "numrows": numRows.toString()
            })
        }
    })
});

router.post('/api/register', function (req, res) {
    let { error } = validateRegister(req.body) ; // result.error
    if (error) {
        res.json({
            "status": "fail",
            "message": error.details[0].message
        })
        return;
    }
    let sql = "INSERT INTO register (username , password , email ) VALUES (" ;
    sql += "'" + req.body.username + "' ," ;
    sql += "'" + req.body.password + "' ," ;
    sql += "'" + req.body.email + "')" ;
    let query = db.query(sql, (err,results) => { // สั่ง Query คำสั่ง sql
        if(err) return res.status(500).json({
            "status": "fail",
            "message": err.sqlMessage.toString() // error.sqlMessage
        })
       res.json({
           "status": "success",
           "message": "Insert into table register success" // error.sqlMessage
       })
    })

});


router.get('/api/Getuser/:username', function (req, res) {
 
    GetUser(req.params.username ,function(rows){

       //res.send(rows[0].email) ;
       res.send(rows) ;

     });
});



function GetUser(username ,callback){ 
    // return callback function
    let sql = "SELECT * FROM register WHERE username ='" + username + "' "  ;
    db.query(sql, (err,results) => { // สั่ง Query คำสั่ง sql
    if(err) {
        throw err  // ดัก error
        //console.log(err) ;
    }    

    //console.log(results) ;
    return callback(results);
    })
}

function validateDepartment(country){ // person is a req.body

    let schema = Joi.object().keys({
        dept_code: Joi.string().length(3).required(),
        dept_name: Joi.string().required()
    });
    
    return  Joi.validate(country, schema);
}

function validateRegister(register){ // person is a req.body

    let schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(16).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(6).required(),
        email: Joi.string().email().required()
    });
    
    return  Joi.validate(register, schema);
}

module.exports = router;
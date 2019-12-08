var Joi = require('@hapi/joi');
var express = require('express');
var router = express.Router();

const persons = [
  { id:1, firstname: 'ปราโมทย์' , email : 'mote@yahoo.com' },
  { id:2, firstname: 'ธัญรัตน์'   , email : 'thanya@hotmail.com' },
  { id:3, firstname: 'ณเดชค่ะ'  , email : 'nadech@yahoo.com' }
]
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource routes/users.js pramote ');

});

router.get('/api/persons', function (req, res) {
  res.send(persons);
});


router.get('/api/persons/:id', function (req, res) {
  let person = persons.find(c => c.id === parseInt(req.params.id));
  if (!person) res.status(404).send('The persons with the given ID' + req.params.id + ' was not found');
  res.send(person);
});


router.post('/api/persons', function (req, res) {

  let { error } = validatePerson(req.body) ; // result.error
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let person = {
    id: persons.length + 1,
    firstname: req.body.firstname,
    email: req.body.email
  };

  persons.push(person);
  res.send(persons);

});

router.put('/api/persons/:id', function (req, res) {
//look up the person
// if not exitsting , return 404
let person = persons.find(c => c.id === parseInt(req.params.id));
if (!person) res.status(404).send('The persons with the given ID' + req.params.id + ' was not found');

// Validate
// if invalid , return 400 - Bad request
let { error } = validatePerson(req.body) ; // result.error
if (error) {
    res.status(400).send(error.details[0].message);
    return;
}

//update person
//return the update person
person.firstname = req.body.firstname ;
person.email =  req.body.email ;
res.send(person) ;

});  

router.delete('/api/persons/:id', function (req, res) {
  //look up the person
  // if not exitsting , return 404
  let deletePerson = persons.find(c => c.id === parseInt(req.params.id));
  if (!deletePerson){
    res.status(404).send('The persons with the given ID' + req.params.id + ' was not found');
    return ;
  }

  //Delete
  const index = persons.indexOf(deletePerson) ;
  persons.splice(index ,1) ; 

  //return the same person
  res.send(deletePerson) ;
});

function validatePerson(person){ // person is a req.body

  let schema = Joi.object().keys({
    firstname: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  });
  
  return Joi.validate(person, schema);

}

module.exports = router;

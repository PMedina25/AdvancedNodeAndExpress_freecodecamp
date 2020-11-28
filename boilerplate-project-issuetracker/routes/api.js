/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const _ = require('underscore');
const Issue = require('../models/issue');


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;

      Issue.find({}).exec((err, issues) => {
        if (err) {
          return res.status(400).json({
            error: 'required field(s) missing'
          });
        }

        res.json(issues);
      });
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let body = req.body;

      let createdOn = new Date();
      let updatedOn = new Date(); 
      
      // Retrieve the values from the form
      let issue = new Issue({
        issue_title: body.issue_title,
        issue_text: body.issue_text,
        created_on: createdOn,
        updated_on: updatedOn,
        created_by: body.created_by,
        assigned_to: body.assigned_to,
        open: true,
        status_text: body.status_text
      });

      issue.save((err, issueDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          });
        }
        
        res.json({
          assigned_to: issueDB.assigned_to,
          status_text: issueDB.status_text,
          open: issueDB.open,
          _id: issueDB._id,
          issue_title: issueDB.issue_title,
          created_by: issueDB.created_by,
          created_on: issueDB.created_on,
          updated_on: issueDB.updated_on,
        });
      })
    })
    
    .put(function (req, res){
      // Devolvemos un array con todas las propiedades válidas, es decir, las que se pueden actualizar
      let body = _.pick(req.body, ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open']);

      Issue.findByIdAndUpdate(req.body._id, 
        body /* Objeto que queremos actualizar */, 
        {new: true /* Devuelve el valor modificado en lugar del original */, 
         runValidators: true},
         (err, issueDB) => {
           if (err) {
             return res.json({
               error: 'could not update ', 
               _id: req.body._id 
             });
           }

           if (req.body._id === "") {
             return res.json({
               error: 'missing_id'
             });
           }

           res.json({
              result: 'successfully updated',
              _id: issueDB._id
           });
         });
    })
    
    .delete(function (req, res){
      let id = req.body._id;

      Issue.findByIdAndRemove(id, (err, issueDeleted) => {
        if (id === "") {
          return res.json({
            error: 'missing_id'
          });
        }

        if (err) {
          return res.json({
            error: 'could not delete',
            _id: id
          });
        }

        res.json({
          result: 'succesfully deleted',
          _id: id
        });
      });
    });
    
};

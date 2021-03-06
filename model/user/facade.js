const mongoose = require('mongoose');
const Facade = require('../../lib/facade');
const contactSchema = require('../contact/schema');
const userSchema = require('./schema')
const error = require('../../services/error');

class UserFacade extends Facade {
  findHelpers() {
    return this.Model
      .find({
        'user_metadata.role': 'helper',
        'user_metadata.profile_complete': true
      }).exec()
  }
  approveHelper(helperid) {
    return this.Model.findOneAndUpdate({ '_id': helperid }, {
      $set: {
        'user_metadata.approved': true
      }
    }, { new: true });
  }
  disapproveHelper(helperid) {
    return this.Model.findOneAndUpdate({ '_id': helperid }, {
      $set: {
        'user_metadata.approved': false
      }
    }, { new: true });
  }
  getUserWithFeed(...args) {
    return this.Model
      .findById(...args, 'user_metadata feed')
      .exec()
  }
  getMetaData(...args) {
    return this.Model
      .findById(...args, 'user_metadata')
      .exec()
  }
  getUserMessages(...args) {
    return this.Model
      .findById(...args, 'messages')
      .exec().then((user) => {
        return Promise.resolve(user.messages)
      }).catch((err) => {
        console.log(err);
        return Promise.reject(err)
      })
  }
  addContactToUser(helperContact, userid) {
    try {
      this.Model.updateOne({ '_id': userid, 'contacts.user_id': { '$ne': helperContact.user_id } }, {
        $push: {
          'contacts': {
            $each: [helperContact], $position: 0
          }
        }
      }, { new: true }, err => {
        if (err) {
          error.throw(err);
        }
      });
    } catch (err) {
      error.logError(0, err);
    }
  }
  addContact(helperid, helpername, userid, username) {
    // Cuando el voluntario asiste a un usuario, ésta se añade a sus contactos y el voluntario es añadido a los contactos del usuario.
    try {
      const contactModel = mongoose.model('contact', contactSchema);
      const date = new Date();

      const userContact = new contactModel({
        user_id: userid,
        name: username,
        contact_date: date
      });

      return this.Model.findOneAndUpdate({ '_id': helperid, 'contacts.user_id': { '$ne': userid } }, {
        $push: {
          'contacts': {
            $each: [userContact], $position: 0
          }
        }
      }, { new: true }, err => {
        if (err) {
          error.throw(err);
        } else {
          this.addContactToUser(new contactModel({
            user_id: helperid,
            name: helpername,
            contact_date: date
          }), userid);
        }
      });
    } catch (err) {
      error.logError(0, err);
    }
  }
  removeContact(id, userid) {
    try {
      return this.Model.findByIdAndUpdate(id, {
        $pull: {
          'contacts': { 'user_id': userid }
        }
      }, { new: true }, err => {
        if (err) {
          error.throw(err);
        } else {
          this.Model.updateOne({ '_id': userid }, {
            $pull: {
              'contacts': { 'user_id': id }
            }
          }, err => {
            if (err) {
              error.throw(err);
            }
          })
        }
      })
    } catch (err) {
      error.logError(0, err);
    }
  }
  deleteContacts(id) {
    return this.Model.findByIdAndUpdate(id,
      { contacts: [] }, { new: true }
    )
  }

}

module.exports = new UserFacade('User', userSchema)

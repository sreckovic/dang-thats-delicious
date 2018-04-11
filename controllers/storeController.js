const mongoose = require('mongoose');
const Store = mongoose.model('Store');
// exports.myMiddleware = (req, res, next) => {
//   req.name = 'Wes';
//   next();
// };

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store'
  });
};

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  // store.save(function(err, store) {
  //   if (!err) {
  //     console.log('It worked!');
  //     res.redirect('/');
  //   }
  // });
  // store
  //   .save()
  //   .then(store => {
  //     res.json(store);
  //   })
  //   .catch(err => {
  //     throw Error(err);
  //   });
  req.flash(
    'success',
    `Successfully created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. Query the db for a list of all stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  // res.json(req.params);
  const store = await Store.findOne({ _id: req.params.id });
  // res.json(store);
  // 2. Confirm they are owner of the store
  // TODO
  // 3. Render out the edit form so user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // Set location data to be a point
  req.body.location.type = 'Point';
  // Find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store insted of old one
    runValidators: true
  }).exec();
  // Redirect to store and tell them it worked
  req.flash(
    'success',
    `Successfully updated <strong>${store.name}</strong>. <a href="${
      store.slug
    }">View Store</a>`
  );
  res.redirect(`/stores/${store._id}/edit`);
};

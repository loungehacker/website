
module.exports.start = function(app, callback) {
  app.listen(app.settings.port, function() {
    app.running = true;
    console.log('[server]: Running at port %s in `%s`.\n', app.settings.port, app.settings.env);

    if (typeof callback === 'function') {
      callback(app);
    }
  });
};

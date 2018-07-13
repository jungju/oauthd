var Q, async, colors, fs, ncp;

fs = require('fs');

colors = require('colors');

Q = require('q');

ncp = require('ncp');

async = require('async');

module.exports = function(env) {
  var copyBasisStructure, doInit, installPlugins;
  installPlugins = function(defer, name) {
    var old_location;
    old_location = process.cwd();
    process.chdir(process.cwd() + '/' + name);
    return async.series([
      function(next) {
        return env.plugins.install({
          repository: "https://github.com/oauth-io/oauthd-admin-auth",
          version: "1.x.x"
        }, process.cwd()).then(function() {
          return next();
        }).fail(function(e) {
          return next(e);
        });
      }, function(next) {
        return env.plugins.install({
          repository: "https://github.com/oauth-io/oauthd-slashme",
          version: "1.x.x"
        }, process.cwd()).then(function() {
          return next();
        }).fail(function(e) {
          return next(e);
        });
      }, function(next) {
        return env.plugins.install({
          repository: "https://github.com/oauth-io/oauthd-request",
          version: "1.x.x"
        }, process.cwd()).then(function() {
          return next();
        }).fail(function(e) {
          return next(e);
        });
      }, function(next) {
        return env.plugins.install({
          repository: "https://github.com/oauth-io/oauthd-front",
          version: "1.x.x"
        }, process.cwd()).then(function() {
          return next();
        }).fail(function(e) {
          return next(e);
        });
      }
    ], function(err) {
      if (err) {
        return defer.reject(err);
      }
      process.chdir(old_location);
      return defer.resolve(name);
    });
  };
  doInit = function(defer, name, plugins) {
    var schema;
    if (plugins) {
      copyBasisStructure(defer, name, 'n');
      return;
    }
    schema = {
      properties: {}
    };
    return copyBasisStructure(defer, name, 'Y');
  };
  copyBasisStructure = function(defer, name, install_default_plugin) {
    env.debug('Generating a folder for ' + name);
    return ncp(__dirname + '/../templates/basis_structure', process.cwd() + '/' + name, function(err) {
      if (err) {
        return defer.reject(err);
      }
      return fs.rename(process.cwd() + '/' + name + '/gitignore', process.cwd() + '/' + name + '/.gitignore', function(err) {
        if (err) {
          return defer.reject(err);
        }
        if (install_default_plugin.match(/[yY]/)) {
          return installPlugins(defer, name);
        } else {
          return defer.resolve(name);
        }
      });
    });
  };
  return function(force_default, options) {
    var defer, exists, plugins;
    defer = Q.defer();
    if (force_default) {
      exists = fs.existsSync('./default-oauthd-instance');
      if (!exists) {
        plugins = options.noplugins ? "n" : "Y";
        copyBasisStructure(defer, "default-oauthd-instance", plugins);
      } else {
        return defer.reject(new Error('Stopped because \'default-oauthd-instance\' folder already exists.'));
      }
    } else {
      if (options.name) {
        exists = fs.existsSync('./' + options.name);
        if (exists) {
          return defer.reject(new Error('Stopped because \'' + options.name + '\' folder already exists.'));
        } else {
          doInit(defer, options.name, options.noplugins);
        }
      } else {
        doInit(defer, "oauthd_instance", options.noplugins);
      }
    }
    return defer.promise;
  };
};

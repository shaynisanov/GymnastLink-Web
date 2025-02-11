module.exports = {
    apps : [{
      name   : "GymnastLink",
      script : "./dist/src/app.js",
      env_production : {
        NODE_ENV: "production"
      }
    }]
  }
  
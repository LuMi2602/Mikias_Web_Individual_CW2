// Logger Middleware
function logger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  }
  
  // Static File Middleware
  app.use('/images', express.static(path.join(__dirname, 'images')));
  
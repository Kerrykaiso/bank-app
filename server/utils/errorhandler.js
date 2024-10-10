function errorHandler(err, req, res, next) {
    res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message || err,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  }
 
  const escapeHtml=(html)=>{
    return html.replace(/[&<>"']/g,'')
  }
  module.exports= {errorHandler,escapeHtml}
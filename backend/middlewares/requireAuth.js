const jwt = require('jsonwebtoken');
const User = require('../model/authModel')
const requireAuth = async(req, res, next) =>{
    //verify authentiation
    
    const {authorization} = req.headers

    if(!authorization || !authorization.startsWith('Bearer ')){
        return res.status(401).json({error: 'authorization token required'});
    }

    
console.log('Authorization header:', req.headers.authorization);
const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
console.log('Extracted token:', token);



try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    console.log('Token verification successful');
    req.user = await User.findOne({ _id }).select('_id');
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    res.status(401).json({ error: 'Request is not authorized' });
  }
  
}

module.exports = requireAuth;







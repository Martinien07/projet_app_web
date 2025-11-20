import jwt from "jsonwebtoken";

export const protect=(req,res,next)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Accès refusé, token manquant'});
    }   
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err){
        res.status(401).json({message:'Token invalide'});
    }   


}

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Accès refusé' });
        }

        // If token contains Roles array with objects that have a 'nom' property
        if (Array.isArray(req.user.Roles)) {
            const hasRole = req.user.Roles.some(r => roles.includes(r.nom));
            if (hasRole) return next();
        }

        // If token contains a single role name or roleId
        if (req.user.role && roles.includes(req.user.role)) return next();
        if (req.user.roleId && roles.includes(String(req.user.roleId))) return next();

        return res.status(403).json({ message: 'Accès interdit: rôle insuffisant' });
    };
};
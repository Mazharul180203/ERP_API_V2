import {pool} from "../db.js";

export const checkPermission = (permission) => async (req, res, next) => {
    const  userId  = parseInt(req.headers.user_id, 10);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const query = `    
        SELECT p.permissionname 
        FROM permission p
        JOIN roletopermission rp ON p.id = rp.permissionid
        JOIN role ur ON rp.roleid = ur.id
        WHERE ur.id = $1 AND p.permissionname = $2
    `;
    const result = await pool.query(query, [userId, permission]);
    if (result.rows.length === 0) {
        return res.status(403).json({ status: 'fail', message: 'Permission denied', data:[]});
    }
    next();
};

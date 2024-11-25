import { isValidObjectId } from "mongoose";

function checkId(req, res, next) {
  // Get the ID from either params.id or params._id
  const id = req.params.id || req.params._id;
  
  if (!id || !isValidObjectId(id)) {
    res.status(404);
    throw new Error(`Invalid Object ID: ${id}`);
  }
  next();
}

export default checkId;

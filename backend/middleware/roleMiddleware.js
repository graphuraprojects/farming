export const allowOwnerOrAdmin = (req, res, next) => {
  if (req.user.role === "owner" || req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Owner or Admin only."
  });
};

export const allowAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only."
  });
};

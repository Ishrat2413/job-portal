export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

router.get("/employers/pending", authenticateToken, isAdmin, getPendingEmployers);
router.put("/employers/:id/approve", authenticateToken, isAdmin, approveEmployer);
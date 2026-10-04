export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request data" });
    }
    req.body = result.data; // replaces req.body with the parsed/sanitized version
    next();
  };
}
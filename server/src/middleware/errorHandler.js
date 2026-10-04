export function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose validation errors (required field missing, enum mismatch,
  // maxlength exceeded, etc.) → 400.
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  // MongoDB duplicate-key error (e.g. registering an email that's
  // already taken, if that check somehow got bypassed) → 409.
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate entry" });
  }

  // Anything else unexpected → 500. The response shape stays IDENTICAL
  // to every other error case — { message: "..." } — regardless of
  // what actually broke, so the frontend only ever needs to handle one
  // consistent error shape.
  res.status(500).json({ message: "Something went wrong" });
}
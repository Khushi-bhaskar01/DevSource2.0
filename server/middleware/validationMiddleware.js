import joi from "joi";

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(",");
    return res
      .status(400)
      .json({ success: false, message: `Validation error ${errorMessages}` });
  }

  next();
};

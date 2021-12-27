export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({
      status: "error",
      message: err.message,
    });
  } else {
    next(err);
  }
};

export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({
      status: "error",
      message: err.message || "You are not logged in",
    });
  } else {
    next(err);
  }
};

export const forbiddenHandler = (err, req, res, next) => {
  if (err.status === 403) {
    res.status(403).send({
      status: "error",
      message: err.message || "You are not allowed to do that",
    });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({
      status: "error",
      message: err.message || "Not found",
    });
  } else {
    next(err);
  }
};

export const catchAllHandler = (err, req, res, next) => {
  res.status(500).send({ status: "error", message: "Generic server error" });
};

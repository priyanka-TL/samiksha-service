module.exports = (req, res, next) => {
  if (req.query.fromDate) {
    let fromDateValue = req.query.fromDate ? new Date(req.query.fromDate.split('-').reverse().join('-')) : new Date(0);
    let toDate = req.query.toDate ? new Date(req.query.toDate.split('-').reverse().join('-')) : new Date();
    fromDateValue.setHours(0, 0, 0);
    toDate.setHours(23, 59, 59);

    if (fromDateValue > toDate) {
      throw {
        status: 400,
        message: 'From Date cannot be greater than to date !!!',
      };
    }

    req.query.fromDate = fromDateValue;
    req.query.toDate = toDate;
  }

  next();
  return;
};

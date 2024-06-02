class APIFeatures {
  constructor(query, queryString, body) {
    this.query = query;
    this.queryString = queryString;
    this.body = body;
  }
  search() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr
      .replace(/\b(gte|gt|lte|lt)\b/g, (str) => `$${str}`)
      .replace("id", "_id");

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
}

module.exports = APIFeatures;

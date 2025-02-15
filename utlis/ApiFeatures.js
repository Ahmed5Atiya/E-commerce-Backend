class ApiFeature {
  constructor(mongooseQuery, QueryString) {
    this.mongooseQuery = mongooseQuery;
    this.QueryString = QueryString;
  }

  sort() {
    if (this.QueryString.sort) {
      // to make the sort form query to be (price quantity) not (price,quentity)
      let sortBy = this.QueryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  filter() {
    const queryStringObj = { ...this.QueryString };
    const ExitQueryString = ["sort", "limit", "page", "fields"];
    ExitQueryString.forEach((field) => delete queryStringObj[field]);
    // applay the filter fot (gte , gt ,lte , le ) fot the porduct
    let QueryStr = JSON.stringify(queryStringObj);
    QueryStr = QueryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(QueryStr));
    return this;
  }

  Limitfields() {
    if (this.QueryString.fields) {
      let fields = this.QueryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  pagination(countDecoment) {
    const page = this.QueryString.page * 1 || 1;
    const limit = this.QueryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const paginat = {};
    paginat.page = page;
    paginat.limit = limit;
    paginat.numberPages = Math.ceil(countDecoment / limit);
    // prev and next page
    if (endIndex < countDecoment) {
      paginat.next = page + 1;
    }
    if (skip > 0) {
      paginat.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    this.paginationResult = paginat;
    return this;
  }

  search() {
    if (this.QueryString.keyword) {
      //   console.log(req.query.keyword);
      let searchBy = {};
      searchBy.$or = [
        { title: { $regex: this.QueryString.keyword, $options: "i" } },
        { description: { $regex: this.QueryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(searchBy);
    }
    return this;
  }
}

module.exports = ApiFeature;

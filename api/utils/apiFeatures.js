class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    //* 1) Filtering products
    const queryStirngObject = { ...this.queryString };
    const excludeFields = ["page", "limit", "sort", "fields", "keyword"];
    excludeFields.forEach((field) => delete queryStirngObject[field]);
    // apply filteration using [get,gt,lte,lt]
    let queryString = JSON.stringify(queryStirngObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // price, -sold - => [price, -sold]=> price -sold
      const sortBy = this.queryString.sort.split(",").join(" ");
      //! sort(price sold) // without comma , 👇
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else this.mongooseQuery = this.mongooseQuery.sort("createdAt");
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      fields += " -__v";
      console.log(`${fields}`.red);
      //? if you want to response all fields except title enter it like -title
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(countDocuments) {
    //  req.query.page * 1 to convert to a number because it is sended as string
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit; // 2page*10limit = 20;

    // Pagination Result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPage = Math.ceil(countDocuments / limit); // 10÷50=0.2pages ==> 1

    // next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResults = pagination;
    return this;
  }
}

module.exports = ApiFeatures;

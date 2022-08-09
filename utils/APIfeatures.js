class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filterOnFields() {
    // GET query params as hard copy
    const queryObj = { ...this.queryString };
    // BUILD QUERY
    // 1A) Filtering
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering to support MongoDB $gte, $gt, $lte, $lt, $in, $nin, $ne
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in|ne|nin)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr)).limit(10);

    return this;
  }

  sortQuery() {
    if (this.queryString.sort) {
      // accepts a string where multiple sort fields are separated by commas
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // sort is set to year: 1 by default. Mongoose > Query.prototype.sort()
      this.query = this.query.sort('year');
    }

    return this;
  }

  limitResults() {
    if (this.queryString.limit) {
      this.query = this.query.limit(this.queryString.limit * 1);
    } else {
      // limit is set to 100 by default
      this.query = this.query.limit(100);
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // page is set to 1 by default
    const limit = this.queryString.limit * 1 || 100; // limit is set to 100 by default
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  selectFields() {
    if (this.queryString.fields) {
      // accepts a string where multiple fields are separated by commas
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // select all fields by default
      this.query = this.query.select('title year _id');
    }

    return this;
  }
}

module.exports = APIfeatures;

// OLD CODE

/*
exports.getMovies = async (req, res) => {
  try {
    console.log(req.query);
    // GET query params as hard copy
    const queryObj = { ...req.query };
    // BUILD QUERY
    // 1A) Filtering
    // const excludedFields = ['sort', 'page', 'limit'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering to support MongoDB $gte, $gt, $lte, $lt, $in, $nin, $ne
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in|ne|nin)\b/g,
      (match) => `$${match}`
    );

    // OPTION 1 > find using query params
    const query = Movie.find(JSON.parse(queryStr))
      .limit(
        // limit is set to 10 by default
        queryObj.limit * 1 || 100
      ) // limit is set to 100 by default
      .skip(((queryObj.page * 1 || 1) - 1) * (queryObj.limit * 1 || 100)) // page is set to 1 by default
      .sort(
        // sort is set to year: 1 by default. Mongoose > Query.prototype.sort()
        // accepts a string where multiple sort fields are separated by commas
        queryObj.sort ? queryObj.sort.split(',').join(' ') : 'year'
      )
      .select(
        queryObj.fields
          ? queryObj.fields.split(',').join(' ')
          : 'title year _id'
      );

    // OPTION 2 > find using mongoose query. ISSUE each param is mandatory. If year is not provided, it will return error.
    // const movies = await Movie.find({})
    //   .where('year')
    //   .equals(query.year)
    //   .where('type')
    //   .equals(query.type)
    //   .limit(query.limit * 1);


    // EXECUTE QUERY
    const movies = await query;

    // SEND response
    res.status(200).json({
      status: 'success',
      count: movies.length,
      data: { movies },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};
*/

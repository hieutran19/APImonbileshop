const pagination = async (model, query, page, limit) => {
    const total = await model.find(query).countDocuments();
    const totalPages = Math.ceil(total / limit);
    const next = page + 1;
    const prev = page - 1;
    const hasNext = page + 1 <= totalPages ? true : false;
    const hasPrev = page - 1 > 0 ? true : false;
  
    return {
      total, 
      totalPages,
      currentPage: page,
      next,
      prev,
      hasNext,
      hasPrev,
    };
  };
  module.exports = pagination;
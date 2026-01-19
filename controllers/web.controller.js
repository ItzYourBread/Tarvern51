const Link = require('../models/Link');

exports.home = async (req, res) => {
  try {
    const categories = ['OF-Models', 'Leaks-Vids', 'Amateur', 'NSFW'];
    const groupedLinks = {};

    // 1. Find the most recently uploaded link to determine the "active day"
    const latestEntry = await Link.findOne().sort({ createdAt: -1 });

    if (!latestEntry) {
      return res.render('pages/index', { groupedLinks: {}, targetDate: null });
    }

    // 2. Define the start and end of that specific day
    const targetDate = new Array(latestEntry.createdAt);
    const startOfDay = new Date(latestEntry.createdAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(latestEntry.createdAt);
    endOfDay.setHours(23, 59, 59, 999);

    // 3. Fetch links ONLY for that specific 24-hour window
    for (const category of categories) {
      groupedLinks[category] = await Link.find({
        category,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ createdAt: -1 });
    }

    res.render('pages/index', { 
      groupedLinks, 
      displayDate: startOfDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.search = async (req, res) => {
  const query = req.query.q || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const filter = query
    ? { $text: { $search: query } }
    : {};

  const totalResults = await Link.countDocuments(filter);

  const results = await Link.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(totalResults / limit);

  res.render('pages/search', {
    results,
    query,
    page,
    totalPages
  });
};

exports.category = async (req, res) => {
  try {
    const category = req.params.name;

    // Pagination config
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 12;
    const skip = (page - 1) * limit;

    // Count total documents in category
    const total = await Link.countDocuments({ category });

    // Fetch paginated results
    const links = await Link.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(total / limit);

    res.render('pages/category', {
      category,
      links,
      page,
      totalPages
    });

  } catch (err) {
    console.error('Category page error:', err);
    res.status(500).render('pages/error', {
      message: 'Failed to load category'
    });
  }
};

exports.smartRedirect = async (req, res) => {
  const link = await Link.findById(req.params.id);
  if (!link) return res.status(404).send('Link not found');

  res.render('pages/smart-redirect', {
    smartUrl: 'https://rtouchingthewaterw.com?A6dBN=1235328',
    realUrl: link.url,
    homeUrl: '/'
  });
};

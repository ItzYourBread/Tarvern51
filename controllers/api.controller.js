const Link = require('../models/Link');

exports.createLink = async (req, res) => {
  try {
    let { title, url, directUrl, category } = req.body;

    if (!title || !url || !directUrl || !category) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // New logic: Only update the title if category is NOT "OF-Models"
    if (category !== 'OF-Models') {
      
      // 1. Generate Initials (Short Code)
      const initials = title
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();

      // 2. Count existing links with this base title
      const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const count = await Link.countDocuments({ 
        title: { $regex: new RegExp(`^${escapedTitle}`, 'i') } 
      });

      // 3. Update title with the count suffix
      title = `${title} - ${initials}${count + 1}`;
    }

    // Create the link (If OF-Models, it uses the original title)
    const link = await Link.create({
      title,
      url,
      directUrl,
      category
    });

    res.json({ success: true, link });

  } catch (error) {
    console.error("Create Link Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
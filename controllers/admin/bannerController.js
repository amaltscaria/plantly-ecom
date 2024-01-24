import Banner from '../../model/Banner.js';

//all banners handler - GET
export const getAllBanners = async (req, re, next) => {
  try {
    const banners = await Banner.find();
    res.render('admin/banners/allBanners', {
      user: req.session.admin,
      banners,
    });
  } catch (err) {
    next(err);
  }
};

//add banner handler - GET
export const getAddBanner = async (req, res, next) => {
  try {
    res.render('admin/banners/addBanner', { user: req.session.admin });
  } catch (err) {
    next(err);
  }
};

//add banner handler - POST
export const postBanner = async (req, res, next) => {
  try {
    const {
      bannerName,
      targetId,
      targetType,
      startDate,
      expiryDate,
      description,
    } = req.body;
    const ifExists = await Banner.findOne({ bannerName });
    if (ifExists) {
      return res
        .status(409)
        .json({ message: 'Banner with same name already exists' });
    }
    const bannerImage = req.file.filename;
    const banner = new Banner({
      bannerName,
      targetId,
      targetType,
      startDate,
      expiryDate,
      description,
      bannerImage,
    });
    await banner.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

//edit banner handler - GET
export const getEditBanner = async (req, res, next) => {
  try {
    const id = req.params.id;
    const banner = await Banner.findOne({ _id: id });
    res.render('admin/banners/editBanner', { user: req.session.admin, banner });
  } catch (err) {
    next(err);
  }
};

//edit banner handler - PATCH
export const patchBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const bannerImage = req.file.filename;
    const {
      bannerName,
      targetId,
      targetType,
      startDate,
      expiryDate,
      description,
    } = req.body;
    const escapedString = bannerName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const ifExists = await Banner.findOne({
      bannerName: new RegExp('^' + escapedString + '$', 'i'),
      _id: { $ne: id },
    });
    if (ifExists) {
      return res.status(409).json({ message: 'Banner name exists already' });
    }
    const banner = await Banner.findOne({ _id: id });
    banner.bannerName = bannerName;
    banner.targetId = targetId;
    banner.targetType = targetType;
    banner.startDate = startDate;
    banner.expiryDate = expiryDate;
    banner.description = description;
    banner.bannerImage = bannerImage;

    await banner.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//list/unlist hander - PATCH
export const listUnlistBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const banner = await Banner.findOne({ _id: id });
    if (banner.isListed) {
      banner.isListed = false;
      await banner.save();
      res.status(200).json({ message: 'listed' });
    } else {
      banner.isListed = true;
      await banner.save();
      res.status(200).json({ message: 'unlisted' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Sever Error' });
  }
};

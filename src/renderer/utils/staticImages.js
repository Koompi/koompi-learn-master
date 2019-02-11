
const staticPath = process.env.NODE_ENV !== 'production' ?
  '/static' : __static;

const staticImages = {
  playIcon() { return `${staticPath}/play-btn.png`; },
  bannerCover() { return `${staticPath}/cover.png`; },
  avatarIcon() { return `${staticPath}/avatar.png`; },
  facebookIcon() { return `${staticPath}/facebook.png`; },
  starIcon() { return `${staticPath}/star.png`; },
  koompiLaptopImage() { return `${staticPath}/koompi-laptop.jpg`; },
  koompiLogo() { return `${staticPath}/koompi-logo.png`; },
};

export default staticImages;

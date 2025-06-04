const WEBSITE_URL = 'https://joblet.lutfifadlan.com';
const LOGO_PNG = '/logo.png';
const GOOGLE_ANALYTICS_ID = '';
const GOOGLE_SITE_VERIFICATION_CONTENT = '';

const Common = {
  title: "Joblet",
  description: "Simple job board platform for job seekers and employers",
  tagline: "Find your next job in seconds, not days",
  image: LOGO_PNG,
  logo: LOGO_PNG,
  liveLogo: `${WEBSITE_URL}/logo.png`,
  websiteUrl: WEBSITE_URL,
}

const Document = {
  title: Common.title,
  description: Common.description,
  fontUrl: 'https://fonts.googleapis.com/css2?family=Grape+Nuts&family=Poppins:wght@300;400;600&family=Work+Sans:wght@300;400;600&family=Bricolage+Grotesque:wght@400;500;600;700&display=swap',
  scripts: {
    autoBackLink: `https://autoback.link/autobacklink.js?ref=${WEBSITE_URL}`,
    gtagId: GOOGLE_ANALYTICS_ID,
  },
  meta: {
    googleSiteVerificationContent: GOOGLE_SITE_VERIFICATION_CONTENT,
    keywordsContent:
      `joblet,
      joblet job board,
      joblet job board platform,
      job board,
      job board platform,
      job board website,
      job board website platform,
      job board website platform     
      `,
  },
  ogImage: LOGO_PNG,
  ogUrl: WEBSITE_URL,
  ogType: 'website',
  icon: LOGO_PNG,
}

const Landing = {
  headline: "Find your next job in seconds, not days",
}

const Email = {
  supportEmail: 'hi@lutfifadlan.com',
  infoDestinationEmail: 'mochamadlutfifadlan@gmail.com',
}

const Launch = {
  Date: 'June 4, 2025',
}


export { Common, Document, Landing, Email, Launch };
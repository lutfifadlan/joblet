const WEBSITE_URL = 'https://joblet.lutfifadlan.com';
const LOGO_PNG = '/logo.png';

const Common = {
  title: "Joblet",
  description: "Simple job board platform for job seekers and employers",
  tagline: "Post jobs in seconds, get applications in minutes",
  image: LOGO_PNG,
  logo: LOGO_PNG,
  liveLogo: `${WEBSITE_URL}/logo.png`,
  websiteUrl: WEBSITE_URL,
}

const Document = {
  title: Common.title,
  description: Common.description,
  fontUrl: 'https://fonts.googleapis.com/css2?family=Grape+Nuts&family=Poppins:wght@300;400;600&family=Work+Sans:wght@300;400;600&family=Bricolage+Grotesque:wght@400;500;600;700&display=swap',
  meta: {
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
  headline: "Hire or Get Hired. Simple.",
  subHeadline: "Browse quality job listings or post your opening in seconds.",
}

const Email = {
  supportEmail: 'hi@lutfifadlan.com',
  infoDestinationEmail: 'mochamadlutfifadlan@gmail.com',
}

const Launch = {
  Date: 'June 4, 2025',
}


export { Common, Document, Landing, Email, Launch };
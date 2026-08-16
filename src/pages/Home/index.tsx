import { Helmet } from "react-helmet-async";

import Hero from "../../components/sections/Hero/Hero";
import Technologies from "../../components/sections/Technologies/Technologies";

/**
 * Technologies stays paired with Hero rather than moving to another page:
 * HeroLogo's scroll-linked recede animation is tuned to finish exactly as
 * Technologies enters view, so splitting them across routes would break
 * that transition.
 */
const HomePage = () => (
  <>
    <Helmet>
      <title>AFAQ AI | Home</title>
    </Helmet>
    <Hero />
    <Technologies />
  </>
);

export default HomePage;

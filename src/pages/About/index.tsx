import { Helmet } from "react-helmet-async";

import About from "../../components/sections/About/About";
import WhyChoose from "../../components/sections/WhyChoose/WhyChoose";
import Process from "../../components/sections/Process/Process";

/**
 * Groups About, Why Choose AFAQ and Our Process — the same "Company" grouping
 * Footer.tsx's own nav already used before this migration.
 */
const AboutPage = () => (
  <>
    <Helmet>
      <title>AFAQ AI | About</title>
    </Helmet>
    <About />
    <WhyChoose />
    <Process />
  </>
);

export default AboutPage;

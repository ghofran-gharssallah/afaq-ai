import { Helmet } from "react-helmet-async";

import Services from "../../components/sections/Services/Services";

const ServicesPage = () => (
  <>
    <Helmet>
      <title>AFAQ AI | Services</title>
    </Helmet>
    <Services />
  </>
);

export default ServicesPage;

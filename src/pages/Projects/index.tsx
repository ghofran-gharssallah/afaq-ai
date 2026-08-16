import { Helmet } from "react-helmet-async";

import Projects from "../../components/sections/Projects/Projects";

const ProjectsPage = () => (
  <>
    <Helmet>
      <title>AFAQ AI | Projects</title>
    </Helmet>
    <Projects />
  </>
);

export default ProjectsPage;

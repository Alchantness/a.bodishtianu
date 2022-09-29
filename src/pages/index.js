import React from "react";
import {
  AboutSection,
  ArticlesSection,
  ContactSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
  Seo,
} from "gatsby-theme-portfolio-minimal";
//TODO Write some articles and add projects
export default function IndexPage() {
  return (
    <>
      <Seo title="Portfolio" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        {/* <ArticlesSection sectionId="articles" heading="Latest Articles" sources={['Blog']} /> */}
        <AboutSection sectionId="about" heading="About me" />
        <InterestsSection sectionId="details" heading="Hard Skills" />
        {/* <ProjectsSection sectionId="features" heading="Projects" /> */}
        <ContactSection sectionId="github" heading="Interested?" />
      </Page>
    </>
  );
}

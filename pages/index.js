import BannerContainer from "../components/BeforeLoggedIn/homePage/banner-container";

function HomePage(props) {
  return <BannerContainer />;
}

export default HomePage;

export async function getStaticProps() {
  return {
    props: { products: ["li", "ram"] },
  };
}

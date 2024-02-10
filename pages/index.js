import BannerContainer from "../components/BeforeLoggedIn/homePage/banner-container";
import { useEffect } from "react";
import axios from "axios";

function HomePage(props) {
  useEffect(() => {
    console.log(1);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `/api/user/get-all-users?page=${null}&courseType=${null}&ttu=${null}&paid=${null}`
      );
      console.log("res success 6", response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  return <BannerContainer />;
}

export async function getServerSideProps(context) {
  return {
    props: { hi: "hiiiii" },
  };
}

export default HomePage;

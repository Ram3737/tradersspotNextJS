import BannerContainer from "../components/BeforeLoggedIn/homePage/banner-container";
import { useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";

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
      // console.log("res success 6", response.data);
    } catch (error) {
      // console.error("Error fetching users:", error);
    }
  };
  return <BannerContainer />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default HomePage;

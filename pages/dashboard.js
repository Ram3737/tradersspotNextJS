import { getSession } from "next-auth/react";

function DashboardPage() {
  return <p>Arambikalangala</p>;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default DashboardPage;

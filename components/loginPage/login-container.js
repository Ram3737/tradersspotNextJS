import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import styles from "./login-container.module.css";
import ButtonComponent from "../commonComponents/buttonComponent/buttonComponent";
import { useState } from "react";

function LoginContainer() {
  const [enteredEmail, setEnteredEmail] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState(null);
  const router = useRouter();

  async function loginSubmitHandler(event) {
    event.preventDefault();

    if (!enteredEmail && !enteredPassword) {
      return;
    }
    const result = await signIn("credentials", {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (!result.error) {
      setEnteredEmail(null);
      setEnteredPassword(null);
      router.push("/dashboard");
    }
  }

  return (
    <div className={styles.login_container_main}>
      <div className={styles.login_container_sub}>
        <p className={styles.heading_text}>Log in to Trader's spot</p>{" "}
        <div className={styles.login_container}>
          <form>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.input_field}
                type="email"
                id="email"
                name="email"
                required
                onChange={(event) => setEnteredEmail(event.target.value)}
              />
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                className={styles.input_field}
                type="password"
                id="password"
                name="password"
                required
                onChange={(event) => setEnteredPassword(event.target.value)}
              />
            </div>
            <ButtonComponent
              handler={loginSubmitHandler}
              text={"Login"}
              style={styles.submit_button}
            />
          </form>
        </div>
      </div>
    </div>
  );
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

export default LoginContainer;

import styles from "../loginPage/login-container.module.css";
import ButtonComponent from "../commonComponents/buttonComponent/buttonComponent";

function RegisterContainer() {
  return (
    <div className={styles.login_container_main}>
      <div className={styles.login_container_sub}>
        <p className={styles.heading_text}>Create your account</p>{" "}
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
              />
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="name">
                Username
              </label>
              <input
                className={styles.input_field}
                type="text"
                id="name"
                name="name"
                required
              />
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="mobile">
                Mobile No
              </label>
              <input
                className={styles.input_field}
                type="tel"
                id="mobile"
                name="mobile"
                required
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
              />
            </div>
            <div className={styles.form_group}>
              <label className={styles.label} htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className={styles.input_field}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
              />
            </div>

            <ButtonComponent text={"Register"} style={styles.submit_button} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterContainer;

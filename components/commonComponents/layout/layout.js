import { Fragment } from "react";
import styles from "./main-navigation.module.css";
import MainNavigation from "./main-navigation";

function Layout(props) {
  return (
    <Fragment>
      <MainNavigation />
      <main className={styles.main_container}>{props.children}</main>
    </Fragment>
  );
}

export default Layout;

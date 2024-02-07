import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/images/logo.svg";
import styles from "./main-navigation.module.css";

function MainNavigation() {
  return (
    <div className={styles.header_outer}>
      <nav className={styles.nav}>
        <div className={styles.nav_left}>
          <div className={styles.logo_container}>
            <Image
              src={Logo}
              alt="Description of image"
              width={28}
              height={28}
            />
            <p>Trader's spot</p>
          </div>

          <ul>
            <li>
              <Link href={""}>Dashboard</Link>
            </li>
            <li>
              <Link href={""}>Analysis statistics</Link>
            </li>
            <li>
              <Link href={""}>Pricing</Link>
            </li>
          </ul>
        </div>
        <div className={styles.nav_right}></div>
      </nav>
    </div>
  );
}

export default MainNavigation;

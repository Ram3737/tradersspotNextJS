import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/images/logo.svg";
import ButtonComponent from "../buttonComponent/buttonComponent";
import { IoMenu } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import styles from "./main-navigation.module.css";

function MainNavigation(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [isMenuBtnClicked, setIsMenuBtnClicked] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function menuBtnHandler() {
    setIsMenuBtnClicked(!isMenuBtnClicked);
  }

  function loginBtnHandler(event) {
    event.preventDefault();
    router.push("/login");
  }

  function registerBtnHandler(event) {
    event.preventDefault();
    router.push("/register");
  }

  function logoutBtnHandler(event) {
    event.preventDefault();
    signOut();
  }

  return (
    <div className={styles.header_outer}>
      <nav className={styles.nav}>
        {windowWidth >= 754 ? (
          <Fragment>
            <div className={styles.nav_left}>
              <div className={styles.logo_container}>
                <Image src={Logo} alt="logo" width={25} height={25} />
                {/* <p>Trader's spot</p> */}
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
            {!session ? (
              <div className={styles.nav_right}>
                <ButtonComponent
                  text={"Sign Up"}
                  handler={registerBtnHandler}
                />
                <ButtonComponent
                  text={"Login"}
                  style={styles.button_transparent}
                  handler={loginBtnHandler}
                />
              </div>
            ) : (
              <div className={styles.nav_right}>
                <ButtonComponent
                  text={"Logout"}
                  style={styles.button_transparent}
                  handler={logoutBtnHandler}
                />
              </div>
            )}
          </Fragment>
        ) : (
          <Fragment>
            <div className={styles.logo_container}>
              <Image
                src={Logo}
                alt="Description of image"
                width={25}
                height={25}
              />
            </div>
            <div className={styles.menu_btn_and_btn}>
              <ButtonComponent
                text={"Try for free"}
                style={styles.menu_option_btn_default}
                handler={registerBtnHandler}
              />
              <div className={styles.menu_btn} onClick={menuBtnHandler}>
                {!isMenuBtnClicked ? (
                  <IoMenu size={25} color="#fff" />
                ) : (
                  <>
                    <IoCloseSharp size={25} color="#fff" />
                    <div
                      className={styles.menu_overlay}
                      onClick={menuBtnHandler}
                    >
                      <div className={styles.menu_container}>
                        <div className={styles.menu_option_container}>
                          <div
                            className={styles.menu_option}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Dashboard</span>
                          </div>
                          <div className={styles.menu_option}>
                            <span>Analysis statistics</span>
                          </div>
                          <div className={styles.menu_option}>
                            <span>Pricing</span>
                          </div>
                        </div>

                        <div className={styles.menu_option_btn_container}>
                          <ButtonComponent
                            text={"Login"}
                            style={styles.menu_option_btn_transparent}
                          />
                          <ButtonComponent
                            text={"Signup"}
                            style={styles.menu_option_btn_default}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Fragment>
        )}
      </nav>
    </div>
  );
}

export default MainNavigation;

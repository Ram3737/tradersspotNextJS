import { useRouter } from "next/router";
import ButtonComponent from "../../commonComponents/buttonComponent/buttonComponent";
import CarouselComponent from "../../commonComponents/carousel/carousel";
import styles from "./banner-container.module.css";

function BannerContainer() {
  const router = useRouter();

  function registerBtnHandler() {
    router.push("/register");
  }

  return (
    <section className={styles.banner_container}>
      <div className={styles.banner_container_sub}>
        <div className={styles.banner_container_sub_content}>
          <div className={styles.why_container}>
            <span className={styles.why_text}>Why Trader's spot</span>
          </div>

          <div className={styles.description_container}>
            <span className={styles.description_text}>
              {`Core satellite`}
              <br />
              {`is a strategy that helps you to`}
            </span>
            <br />
            <br />
            <div className={styles.altered_text_container}>
              <span
                className={styles.description_text_altered}
                style={{ marginLeft: 0 }}
              >
                enumerate
              </span>
              <span
                className={styles.description_text_altered}
                style={{ color: "#ff802b", backgroundColor: "#391a03" }}
              >
                analyze
              </span>
              <span className={styles.description_text}>&</span>
              <span
                className={styles.description_text_altered}
                style={{ color: "#3cb179", backgroundColor: "#0f291e" }}
              >
                trade
              </span>
            </div>
          </div>

          <p className={styles.small_desciption_text}>
            Create universal native apps with React that run on Android,and the
            web. Iterate with confidence.
          </p>

          <div className={styles.banner_btn_container}>
            <ButtonComponent
              text={"Sign up for free"}
              style={styles.banner_btn_container_signup}
              handler={registerBtnHandler}
            />
            <ButtonComponent
              text={"View our analyses"}
              style={styles.banner_btn_container_view_analyses}
            />
          </div>
        </div>
        <div className={styles.banner_container_sub_slider}>
          <CarouselComponent />
        </div>
      </div>
    </section>
  );
}

export default BannerContainer;

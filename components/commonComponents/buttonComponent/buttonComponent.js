import styles from "./buttonComponent.module.css";

function ButtonComponent({ style, text, handler, loader }) {
  return <button className={`${styles.button} ${style}`}>{text}</button>;
}

export default ButtonComponent;

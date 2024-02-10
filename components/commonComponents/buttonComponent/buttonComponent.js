import { motion } from "framer-motion";
import styles from "./buttonComponent.module.css";

function ButtonComponent({ style, text, handler, loader }) {
  return (
    <motion.button
      className={`${styles.button} ${style}`}
      whileHover={{ scale: 1.05, backgroundColor: "#31b5b9" }}
      onClick={handler}
    >
      {text}
    </motion.button>
  );
}

export default ButtonComponent;

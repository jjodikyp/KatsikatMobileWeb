import { motion } from "framer-motion";

const AnimatedButton = ({ children, className, onClick, disabled }) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.2}}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.9 }}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton; 
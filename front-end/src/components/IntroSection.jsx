import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";


const IntroSection = ({ setIntroComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white h-screen w-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, delay: 0.1 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 1 }}
        animate={{
          scale: 0.1,
          x: -window.innerWidth / 2 + 50,
          y: -window.innerHeight / 2 + 50,
        }}
        transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
        onAnimationComplete={() => setIntroComplete(true)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: [0, 0] }}
            transition={{ duration: 2, ease: "linear" }}
          >
            <FaCode className="text-yellow-500 text-[260px]"/>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[200px] pt-10 mr-20 font-bold bg-gradient-to-r from-yellow-400 to-black text-transparent bg-clip-text"
          >

             DTR
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default IntroSection;
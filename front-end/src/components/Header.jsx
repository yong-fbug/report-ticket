import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ currentDate, isFileLoaded }) => (
  <>
    <motion.h1 
      className="uppercase font-serif text-3xl font-bold text-center mb-6 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      transition={{ duration: 2 }}
    >
      Daily Ticketing Report
    </motion.h1>
    {isFileLoaded && <p className="text-center mb-6">{currentDate}</p>}
  </>
);

export default Header;
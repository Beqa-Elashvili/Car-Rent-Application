"use client";

import { IoIosMenu } from "react-icons/io";
import { GiCarKey } from "react-icons/gi";
import { FaHandPeace } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="absolute w-full text-white h-full text-2xl z-10 top-2">
      <div className="flex justify-between px-2">
        <div className="flex relative items-center  gap-2">
          <button onClick={() => setIsOpen(!isOpen)}>
            <IoIosMenu
              className={`text-3xl transition-transform  duration-300 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
          <p>Menu</p>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute left-0 top-8 h-full rounded-e-lg"
              style={{
                background:
                  "linear-gradient(174deg, rgba(235,216,0,1) 1%, rgba(206,125,20,1) 37%, rgba(209,127,20,1) 49%, rgba(74,52,5,1) 98%)",
              }}
            >
              <div className="p-6 flex flex-col gap-2 text-xl">
                <p>Rent</p>
                <p>Costumer</p>
                <p>Date</p>
                <p>Sumbit</p>
                <p>ReCall</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <GiCarKey />
          <p>Rental Cars</p>
        </div>
        <div className="flex items-center">
          <h1 className="text-2xl flex items-center gap-2">Relax</h1>
          <FaHandPeace />
        </div>
      </div>
    </div>
  );
}

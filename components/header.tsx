import Link from "next/dist/client/link";
import React, { useEffect } from "react";

const Header = () => {

  return (
    <main>
      <div className="flex justify-between items-center py-5 px-5">
      <Link href="https://www.therapytrainings.com" target="_blank" rel="noopener noreferrer">
              <img
                height={80}
                width={250}
                src="./images/logo.png"
                alt="logo"
                className="cursor-pointer"
              />
            </Link>
      </div>

      <div
        className="relative py-8 px-5 rounded-xl mt-2 mx-5"
        style={{
          background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
          border: "1px solid #dcdcdc",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-0">
          <img
            src="./images/bg.png"
            alt="wave background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h1 className="lg:text-[26px] lg:text-left text-center text-lg font-bold font-roboto">
          Mental Health Assessment Simulator: For Professional Education Only
          </h1>
        </div>
      </div>
    </main>
  );
};

export default Header;

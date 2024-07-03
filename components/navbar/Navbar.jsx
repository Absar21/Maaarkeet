import React, { useState } from "react";
import Link from "next/link";
import { navLinks } from "../../data";
import { useRouter } from "next/router";
import {
  AiOutlineMenuUnfold,
  AiOutlineMenuFold,
  AiOutlinePlus,
} from "react-icons/ai";
import BtnMain from "../../subcomponents/btns/BtnMain";
import Image from "next/image"; // Importing Next.js Image component

export default function Navbar() {
  const router = useRouter();
  const [isMobileNavOpen, setisMobileNavOpen] = useState(false);

  const handleClick = () => {
    router.push("/sell");
    if (isMobileNavOpen) {
      setisMobileNavOpen(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap sys-app-notCollapsed">
        <div className="w-full">
          <div className="pb-0 py-2 px-2 mx-auto">
            <div className="w-full flex justify-between items-center p-2 text-white bg-gray-800 rounded-lg shadow-lg font-medium capitalize">
              <div className="flex items-center">
                <span className="px-2 mr-2 md:border-r border-gray-700 flex items-center">
                  {/* Adjusted width and height of the Image component */}
                  <Image
                    src="/dark-grey-background-designify (1).png" // Adjust the path according to your actual image location
                    alt="alt placeholder"
                    width={300} // Adjust width as needed
                    height={80} // Adjust height as needed
                    className="inline-block"
                  />
                </span>
                <div className="px-2 md:flex gap-x-5 items-center flex-1 text-white font-medium capitalize hidden">
                  {navLinks?.map(({ title, link, icon }, id) => (
                    <Link key={id} href={link}>
                      <a
                        id={id}
                        className={`px-2 py-1 flex items-center cursor-pointer hover:bg-gray-700 hover:text-gray-200 text-sm rounded ${
                          router.pathname == link
                            ? "text-gray-200 font-semibold"
                            : ""
                        }`}
                      >
                        <span className="p-2 bg-gray-200 rounded-full">
                          {icon}
                        </span>
                        <span className="mx-1">{title}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="md:flex gap-x-5 items-center">
                <BtnMain
                  text="List NFT"
                  icon={<AiOutlinePlus className="text-2xl" />}
                  className="md:flex hidden bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  onClick={handleClick}
                />
                <div className="md:hidden transition-all mr-3 my-3 cursor-pointer hover:text-gray-200">
                  {isMobileNavOpen ? (
                    <AiOutlineMenuFold
                      onClick={() => setisMobileNavOpen(false)}
                      className="rounded text-2xl"
                    />
                  ) : (
                    <AiOutlineMenuUnfold
                      onClick={() => setisMobileNavOpen(true)}
                      className="rounded text-2xl"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div
            id="navbar"
            className={`pt-0 absolute top-2 z-100 mx-auto ${
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            } transition-all flex-wrap md:hidden`}
          >
            <div className="py-[.5px] w-64">
              <div className="w-full py-4 space-y-6 px-2 text-gray-900 bg-gray-800 rounded-lg min-h-screen text-left capitalize font-medium shadow-lg">
                <img
                  src="/dark-grey-background-designify (1).png"
                  alt="alt placeholder"
                  width={300} // Adjust width as needed
                  height={80} // Adjust height as needed
                  className="inline-block"
                
                />
                {navLinks?.map(({ title, link, icon }, id) => (
                  <Link key={id} href={link}>
                    <a
                      id={id}
                      className={`px-2 flex items-center cursor-pointer hover:bg-gray-700 hover:text-gray-200 text-sm rounded ${
                        router.pathname == link
                          ? "text-gray-200 font-semibold"
                          : ""
                      }`}
                    >
                      <span className="p-2 bg-gray-200 rounded-full">
                        {icon}
                      </span>
                      <span className="mx-1">{title}</span>
                    </a>
                  </Link>
                ))}
                <BtnMain
                  text="List NFT"
                  icon={<AiOutlinePlus className="text-2xl" />}
                  className="w-full !rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  onClick={handleClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

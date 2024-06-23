"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";


const Sidebar = () => {

  return (
    <>
      <div className="w-52 h-screen bg-gray-300 border-r-2 border-black p-4">

        <div className="text-center pt-10">
          <Link href="/product/" className=" block item-center cursor-pointer p-2 no-underline text-black font-semibold rounded hover:bg-gray-400">
            Product
          </Link>
        </div>

      </div>
    </>
  );
};

export default (Sidebar);

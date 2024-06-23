"use client";
import React, { useState, useEffect, useDeferredValue, useRef } from "react";
import Image from "next/image";
import searchIcon from "../../public/search.svg";
import DeleteModal from "@/components/DeleteModal";
import withAuth from "@/components/withAuth";
import crossIcon from "../../public/x-circle.svg";
import Link from "next/link";
import pencilIcon from "../../public/pencil.svg";
import trashIcon from "../../public/trash.svg";
import { useList, useDelete, useCategories } from "@/redux/api/product";
import moment from "moment";

const Product = () => {
  const [page, setpage] = useState(1);
  const [searchVal, setSearchval] = useState("");
  const [deleterecord, setdeleteRecord] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const deferredValue = useDeferredValue(searchVal);
  const ref = useRef(false)

  let reqdata = {
    search_text: deferredValue,
    category: ''
  }

  const { data, isLoading, isSuccess, refetch } = useList(reqdata);
  const [deleteResource] = useDelete();
  const [categoryList] = useCategories();

  useEffect(() => {
    refetch();
  }, [searchVal]);



  const handleDelete = async () => {
    let deleteData = {
      id: deleteId?.id,
      owner: deleteId?.owner
    };
    try {
      let res = await deleteResource(deleteData);
      if (res.data) {
        setDeleteId("");
        refetch();
        alert(res?.data?.message)
      }
      else {
        alert(res.error.data.message)
      }
    } catch (error) {
      console.log(error)
    }
    setdeleteRecord(false);
  };


  return (
    <>

      <>
        {deleterecord && (
          <DeleteModal
            setDeleteModal={() => (setdeleteRecord(false), setDeleteId(""))}
            deleteUser={handleDelete}
          />
        )}

        <div className='p-3'>
          <div className="flex flex-col md:flex-row items-center justify-between p-2 ">
            <div className='font-bold text-2xl '>Product Management</div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
              <div className='p-2 rounded flex items-center border-black shadow '>
                <Image src={searchIcon} alt="search" />
                <input
                  onChange={(e) => (setSearchval(e.target.value), setpage(1))}
                  type="text"
                  value={searchVal}
                  className='w-full outline-none'
                  placeholder="Search by Name..."
                />
                {searchVal != "" && (
                  <Image
                    src={crossIcon}
                    onClick={() => setSearchval("")}
                    alt=""
                    className="mr-3 cursor-pointer"
                  />
                )}
              </div>
              <Link href={"/addEditProduct"} className='bg-pink-600 px-2 py-2 rounded text-white hover:bg-pink-400 no-underline'>
                Add Product
              </Link>
            </div>
          </div>


          <div className="mt-6 ">
            <table className='border-2 border-gray-300 w-full shadow'>
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left py-2 p-1 text-sm"> Id</th>
                  <th className="text-left text-sm ">Name </th>
                  <th className="text-left text-sm"> Pro. Code</th>
                  <th className="text-left text-sm"> Image</th>
                  <th className="text-left text-sm"> Price</th>
                  <th className="text-left text-sm"> Category</th>
                  <th className="text-left text-sm"> Manfacture Date</th>
                  <th className="text-left text-sm"> Expiry Date</th>
                  <th className="text-left text-sm"> Owner</th>
                  <th className="text-left text-sm"> Status</th>
                  <th className="text-center text-sm min-w-[100px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {isSuccess && data?.data?.length > 0 ? (
                  data?.data?.map((para, ind) => (
                    <tr
                      key={ind}
                      className="border-b border-b-1"
                    >
                      <td className="text-left text-sm py-2 px-1">
                        {ind + 1 + (page - 1) * 5}
                      </td>

                      <td className="text-left text-sm">
                        {`${para?.name}`}
                      </td>

                      <td className="text-left text-sm">
                        {`${para?.productCode}`}
                      </td>

                      <td className="text-left text-sm">
                        {para?.image ?
                          <img
                            src={`${para?.image}`}
                            alt="image"
                            className="mx-1 w-7 h-7 rounded-sm"
                          /> : '--'}
                      </td>

                      <td className="text-left text-sm">
                        {`${para?.price}`}
                      </td>

                      <td className="text-left text-sm">
                        {para?.category}
                      </td>

                      <td className="text-left text-sm">
                        { }
                        {moment(para?.manufactureDate).format('DD-MM-YYYY')}
                      </td>

                      <td className="text-left text-sm">
                        {moment(para?.expiryDate).format('DD-MM-YYYY')}
                      </td>

                      <td className="text-left text-sm">
                        {para?.owner}
                      </td>

                      <td className="text-left text-sm">
                        {para?.status}
                      </td>

                      <td className="flex justify-center pt-2">
                        <Link
                          href={`/addEditProduct?Id=${para.id}`}
                        >
                          <Image
                            src={pencilIcon}
                            alt="edit"
                            className=" mx-1 cursor-pointer inline-block"
                            width={20}
                            height={20}
                          />
                        </Link>
                        <Image
                          src={trashIcon}
                          alt="delete"
                          className="mx-1 cursor-pointer inline-block"
                          width={20}
                          height={20}
                          onClick={() => (
                            setdeleteRecord(true), setDeleteId(para)
                          )}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="">
                    <td className={`text-center`} colSpan={18}>
                      No Record Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>

    </>
  );
};
export default withAuth(Product);

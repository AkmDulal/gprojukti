"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from '@/services/Url'
import { saveAs } from 'file-saver';
import json2csv from 'json2csv';
import { RiPhoneLine } from "react-icons/ri";

export default function Home() {
  const [datalist, setDatalist] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [singleView, setSingleView] = useState<any>([])
  const [pagesSize, setPagesSize] = useState<number>()
  const getApiData = () => {
    setLoader(false)
    axios.get(`/api/v1.0/store/public/store`)
      .then(res => {
        setDatalist(res?.data?.data)
        setPagesSize(res?.data?.meta_data?.total)
        setLoader(true)
      })
  }

  const downloadCsv = () => {
    setLoader(false)
    const fields = [
      'district.name',
      'name',
      'type',
      'slug',
      'address',
      'primary_phone',
      'secondary_phone',
      'location',
      'map_link',
      'opening_time',
      'closing_time',
      'shown_in_website',
      'off_days'
    ];
    axios.get(`/api/v1.0/store/public/store?page_size=${pagesSize}`)
      .then(res => {
        setLoader(true)
        const csv = json2csv.parse(res?.data?.data, { fields });
        const fileName = 'data.csv';
        const fileType = 'text/csv;charset=utf-8';

        const blob = new Blob([csv], { type: fileType });
        saveAs(blob, fileName);
      })

  }

  const openModal = (slug: string) => {
    const dataView = datalist?.find((el: any) => el.slug === slug)
    console.log(dataView, "dataView");
    setSingleView(dataView)
    setShowModal(true)
  }
  useEffect(() => {
    getApiData()
  }, []);

  // console.log(singleView, "singleView singleView");
  // console.log(datalist, "datalist datalist");
  return (
    <main className="relative min-h-screen  container px-4 mt-4 m-auto">

      {loader ?
        <>
          <div className="flex text-gray-600">
            <div className="w-4/6 "> GProjukti.com </div>
            <div className="w-2/6 flex justify-end mb-2">
              <button className='bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs' onClick={downloadCsv}>Export CSV</button>
            </div>
          </div>
          {showModal ? (
            <>
              <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                  <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-full ">
                    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">Name</div>
                        <p className="flex-1">{singleView?.name}</p>
                      </div>
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">Address</div>
                        <p className="flex-1">{singleView?.address}</p>
                      </div>
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">District</div>
                        <p className="flex-1">{singleView?.district?.name}</p>
                      </div>
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">Phone</div>
                        <p className="flex-1">{singleView?.primary_phone}</p>
                      </div>
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">Opening Time</div>
                        <p className="flex-1">{singleView?.opening_time}</p>
                      </div>
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">Closing Time</div>
                        <p className="flex-1">{singleView?.closing_time}</p>
                      </div>
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">Off Days</div>
                        <p className="flex-1">{singleView?.off_days[0]}</p>
                      </div>
                      <div className="text-gray-700 flex flex-col">
                        <div className="text-lg font-bold mb-2">Map Link</div>
                        <p className="flex-1">{singleView?.map_link}</p>
                      </div>
                    </div>
                    <div className="p-4 md:p-8 bg-gray-100 flex justify-end">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
          <div className="max-w-screen overflow-hidden overflow-x-scroll bg-gray-100 font-sans">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="p-2 text-left whitespace-nowrap">Name</th>
                  <th className="p-2 text-left whitespace-nowrap">Address</th>
                  <th className="p-2 text-left whitespace-nowrap">Phone</th>
                  <th className="p-2 whitespace-nowrap">Opening time</th>
                  <th className="p-2 whitespace-nowrap">Closing time</th>
                  <th className="p-2 whitespace-nowrap">Map</th>
                  <th className="p-2 whitespace-nowrap">Off days</th>
                  <th className="p-2 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y text-gray-600 text-sm font-light">
                {datalist.map((item: any, i: number) => (
                  <tr key={i} className="text-gray-700 border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 whitespace-nowrap">{item.name}</td>
                    <td className="p-2 whitespace-nowrap"> {item.address}</td>
                    <td className="p-2 whitespace-nowrap">
                      <span className='flex'> {item.primary_phone}</span>
                    </td>
                    <td className="p-2 whitespace-nowrap">{item.opening_time}</td>
                    <td className="p-2 whitespace-nowrap">{item.closing_time}</td>

                    <td className="p-2 whitespace-nowrap">
                      <div style={{ width: "150px" }}>
                        <a href={`${item?.map_link}`} target="_blank" rel="noreferrer">
                          <span className="ml-2 text-blue-500">View on map</span>
                        </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 px-6 text-center"><span className='bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs'>  {item.off_days[0]} </span></td>

                    <td className="p-2 whitespace-nowrap item-center justify-center">
                      <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" onClick={() => openModal(item?.slug)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </> :
        <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
          <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
          <span className="sr-only">Loading...</span>
        </div>
      }

    </main>
  )
}

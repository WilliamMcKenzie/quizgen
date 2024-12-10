"use client";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import LoadingScreen from "@/app/components/loading_screen";
import { motion } from "framer-motion";
import FinishScreen from "@/app/components/finish_screen";

const fetcher = (url: string, data: AxiosRequestConfig<any> | undefined) => {
  return axios.get(url, data).then(res => res.data);
};

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export default function Quiz({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState()

  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser(){
    if(getCookie("user")){
      setUser(JSON.parse(getCookie("user")!))
      console.log(JSON.parse(getCookie("user")!))
    }
  }

  return (
    <main className={`main_font`}>
        
    </main>);
}
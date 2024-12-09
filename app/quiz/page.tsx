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
  const router = useRouter();

  const modalRef = useRef<HTMLDialogElement>(null);
  const quizID = params.id;
  const [quiz, setQuiz] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [curStep, setStep] = useState(0);
  const [user, setUser] = useState({ quizDetails : { "" : { q : 0, c : 0 } }})

  useEffect(() => {
    fetchUser()
  }, []);

  async function fetchUser(){
  }

  async function goToStep(index: number) {
    if(index <= curStep){
        setQuiz([])
        router.push(`/quiz/${quizID}/${index}`);
    }
  }

  return (
    <main className={`main_font`}>
        
    </main>);
}
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

export default function Quiz({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState()
  const [user, setUser] = useState()
  const [blanks, setBlanks] = useState(9)

  useEffect(() => {
    if(localStorage.getItem("user")){
      setUser(JSON.parse(localStorage.getItem("user")!))
      setQuizzes(JSON.parse(localStorage.getItem("user")!).quizzes)
      const tempQuizzes = JSON.parse(localStorage.getItem("user")!).quizzes
      
      if (tempQuizzes) {
        const quizCount = tempQuizzes["length"]
        var tempBlanks = Math.max(0, 9 - quizCount)

        if (quizCount > 9) {
          tempBlanks += 3 - (quizCount % 3)
        }

        setBlanks(tempBlanks)
      }
    }
    else {
      router.push("/")
    }
  }, [])

  return (
    <div style={{overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh"}} className={`min-h-screen mx-auto items-center justify-center flex flex-col main_font`}>
      <div className="absolute top-5 w-full text-3xl flex items-center">
            <button className="btn mr-auto ml-5 absolute" onClick={() => {router.push(`/`)}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </button>
            <div className="text-center text-3xl font-bold mr-auto ml-auto">
              QUIZZES
            </div>
      </div>
      <div className="mt-40" style={{ overflow: "scroll", maxHeight: "26rem", width: "74rem", display: "grid", gridGap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))"}}>
        {
          user ?
          quizzes.map((quiz, index) => {
            if (!JSON.parse(user!.quizDetails)[quiz.code]) {
              return <></>
            }

            return <div key={index} onClick={() => router.push("/quiz/" + quiz.code)} className={"w-96 h-32 btn " + ((JSON.parse(user!.quizDetails)[quiz.code].step == JSON.parse(quiz.content).length) ? (index % 3 == 0 ? "btn-primary" : index % 3 == 1 ? "btn-secondary" : "btn-accent") : "")}>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{quiz.name}</h2>
              <p>Progress {JSON.parse(user!.quizDetails)[quiz.code].step}/{JSON.parse(quiz.content).length}</p>
            </div>
          </div>
          })
          : <></>
        }
        {
            Array.from({ length: blanks }).map((_, index) => (
              <div key={index} className={"w-96 h-32 bg-zinc-100"}/>
            ))
          }
      </div>
    </div>);
}
"use client";
import { CheckCircle, Circle, Stars } from "@mui/icons-material";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import { IconButton, Step } from "@mui/material";
import styles from './quiz.module.css'
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
  const [ranking, setRanking] = useState({})
  const [curStep, setStep] = useState(0);
  const [user, setUser] = useState({ email : "", quizDetails : { "" : { q : 0, c : 0 } }})

  const [ratio, setRatio] = useState([0,0])
  const margins = [-70,70]

  const [showFinishScreen, setSFS] = useState(false)

  useEffect(() => {
    init()
  }, []);

  async function init() {
    await fetchUser()
  }

  async function fetchUser(){
    const fetchedQuiz = await fetcher(`/api/fetchQuiz?id=${quizID}`, undefined)
    if (!fetchedQuiz) {
      router.push("/")
    }
    else {
      setQuiz(JSON.parse(fetchedQuiz.content))
      setQuizName(fetchedQuiz.name)
      setRanking(fetchedQuiz.ranking)

      if(getCookie("user")){
        setUser(JSON.parse(getCookie("user")!))
        
        if(JSON.parse(JSON.parse(getCookie("user")!).quizDetails)[quizID]){
          var quizJSON = JSON.parse(JSON.parse(getCookie("user")!).quizDetails)[quizID]
          setStep(quizJSON.step)

          if(quizJSON.step >= JSON.parse(fetchedQuiz.content).length) setSFS(true);
          
          var t = quizJSON.q
          var c = quizJSON.c
          setRatio([c, t])
        } 
        else {
          const newStep = await fetcher(`/api/updateQuiz?uid=${JSON.parse(getCookie("user")!).id}&qid=${quizID}&q=0&c=0&step=-1`, undefined)
          document.cookie = `user=${JSON.stringify(newStep)}; path=/`
        }
      } else {
        router.push("/?go="+quizID)
      }
    }
  }

  async function goToStep(index: number) {
    if(index <= curStep){
        setQuiz([])
        router.push(`/quiz/${quizID}/${index}`);
    }
  }

  return (
    <main className={`${styles.container} main_font`}>
        {showFinishScreen ? <FinishScreen userEmail={user.email} ranking={ranking} rank={ratio[0]/ratio[1] < 0.5 ? "ROOKIE" : ratio[0]/ratio[1] < 0.75 ? "NOVICE" : ratio[0]/ratio[1] < 0.9 ? "EXPERT" : "CERTIFIED BADASS"}></FinishScreen> : quiz[0] ? <>
          <div className="absolute top-5 w-full text-3xl flex items-center">
            <button className="btn mr-auto ml-5" onClick={() => {router.push(`/`)}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </button>
            <div className="text-center text-3xl font-bold">
              {quizName.toUpperCase()}
            </div>
            <button className="btn ml-auto mr-5" onClick={
                () => {
                  if (modalRef.current) {
                    modalRef.current?.showModal()
                  }
                }
              }>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </button>
          </div>
          <dialog ref={modalRef} id="share_modal" className="modal">
            <div className="modal-box" style={{maxWidth: "fit-content"}}>
              <h3 className="font-bold text-lg">Share</h3>
              <div className="stats">
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <button className="btn btn-circle btn-ghost" onClick={() => {navigator.clipboard.writeText(quizID)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                      </svg>
                    </button>
                  </div>
                  <div className="stat-title">Join with code</div>
                  <div className="text-2xl font-bold">{quizID}</div>
                  <div className="stat-desc">Press join on home screen</div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-accent">
                    <button className="btn btn-circle btn-ghost" onClick={() => {navigator.clipboard.writeText(window.location.host + "/quiz/" + quizID)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                      </svg>
                    </button>
                  </div>
                  <div className="stat-title">Join with link</div>
                  <div className="font-bold text-xl">{window.location.host}/quiz/{quizID}</div>
                  <div className="stat-desc">Type into your search bar</div>
                </div>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
          {quiz.map((step, index) => (
          <motion.div className={styles.step} key={`step_${index}`} style={{margin: 10, marginLeft: margins[index % 2]}}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
              }}>
              <button onClick={() => goToStep(index)} className={`btn btn-circle ${index > curStep ? "btn" : index == curStep ? "btn-primary" : "btn-secondary"}`}>
                <div>
                  {index+1}
                </div>
              </button>
          </motion.div>))}
        </> : <LoadingScreen></LoadingScreen>}
    </main>);
}
"use client";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Check} from "@mui/icons-material";
import styles from './step.module.css'
import { Button } from "@mui/material";
import LoadingScreen from "@/app/components/loading_screen";

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

export default function Step({ params }: { params: { id: string, step: number } }) {
  const router = useRouter();
  const quizID = params.id;
  const curStepNUM = params.step;

  const [user, setUser] = useState({ id: null})
  const [step, setStep] = useState({name:"",questions:[{question:"",responses:[],correctIndex:0}]})
  const [question, setQuestion] = useState(0)
  const [score, setScore] = useState(0)

  const [selectedAnswer, setSA] = useState(-1)
  const [correctAnswer, setCA] = useState(-1)

  const [disableButtons, setDB] = useState(false)

  async function goToQuiz() {
    setStep({name:"",questions:[{question:"",responses:[],correctIndex:0}]})
    const newUser = await fetcher(`/api/updateQuiz?uid=${user.id}&qid=${quizID}&q=${step.questions.length}&c=${score}&step=${curStepNUM}`, undefined)
    document.cookie = `user=${JSON.stringify(newUser)}; path=/`
    router.push(`/quiz/${quizID}`);
  }
  async function fetchQuizInit(){
    const fetchedQuiz = await fetcher(`/api/fetchQuiz?id=${quizID}`, undefined)
    setStep(JSON.parse(fetchedQuiz.content)[curStepNUM])
  }
  function fetchUser(){
    if(getCookie("user")){
      return JSON.parse(getCookie("user")!)
    }
  
    return false
  }
  useEffect(() => {
    fetchQuizInit()
    fetchUser() ? setUser(fetchUser()) : router.push("/")
  }, []);

  return (<div className={`${styles.container} main_font`}>
    {step.name == "" ? <LoadingScreen></LoadingScreen> : <main className={`${styles.container} main_font`}>
      {question >= 0 ? (
        <>
          <h1 style={{fontSize:'2rem'}} className="main_font font-bold">{step.name.toUpperCase()}</h1>
          <p style={{marginBottom:'100px', marginTop:'10px'}} className="main_font">{step.questions[question].question}</p>
          <div className={styles.selection_box}>
            {step.questions[question].responses.map((response, index) => (
              <button disabled={disableButtons} className={"input input-bordered " + (correctAnswer == index ? styles.correct_answer : correctAnswer >= 0 && selectedAnswer == index ? styles.wrong_answer : selectedAnswer == index ? styles.selected_button : "NULL")} key={index}
                onClick={() => {
                  setSA(index)
                }}
              >
                <a>{index+1}</a>
                {response}
              </button>
            ))}
            {
              correctAnswer != -1 ? (
                <button
                  className={`btn btn-secondary mt-6-i w-auto-i`}
                  onClick={() => {
                    setSA(-1)
                    setCA(-1)
                    setDB(false)
                    if (question < step.questions.length - 1) setQuestion(question + 1);
                    else setQuestion(-1);
                  }}
                >
                  CONTINUE
                </button>
              ) : (
                <button
                  disabled={selectedAnswer >= 0 ? false : true}
                  className={`btn btn-primary mt-6-i w-auto-i`}
                  onClick={() => {
                    if (selectedAnswer === step.questions[question].correctIndex) {
                      //correct
                      setScore(score + 1);
                    } else {
                      //incorrect
                    }
                    setCA(step.questions[question].correctIndex)
                    setDB(true)
                  }}
                >
                  CHECK
                </button>
              )
            }
          </div>
        </>
      ) : (
        <>
          <button className={`btn btn-accent`} onClick={() => goToQuiz()}>
            YOUR SCORE IS {score} OUT OF {step.questions.length}
          </button>
        </>
      )}
    </main>}
    </div>);
}
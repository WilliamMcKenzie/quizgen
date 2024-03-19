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

export default function Step({ params }: { params: { id: string, step: number } }) {
  const router = useRouter();
  const courseID = params.id;
  const curStepNUM = params.step;

  const [step, setStep] = useState({name:"",questions:[{question:"",responses:[],correctIndex:0}]})
  const [question, setQuestion] = useState(0)
  const [score, setScore] = useState(0)

  const [selectedAnswer, setSA] = useState(-1)
  const [correctAnswer, setCA] = useState(-1)

  const [disableButtons, setDB] = useState(false)

  async function goToCourse() {
    setStep({name:"",questions:[{question:"",responses:[],correctIndex:0}]})
    await fetcher(`/api/updateCourse?id=${courseID}&q=${step.questions.length}&c=${score}`, undefined)
    router.push(`/course/${courseID}`);
  }
  async function fetchCourseInit(){
    const fetchedCourse = await fetcher(`/api/fetchCourse?id=${courseID}`, undefined)
    setStep(JSON.parse(fetchedCourse.content)[curStepNUM])
  }
  useEffect(() => {
    fetchCourseInit()
  }, []);

  return (<div className={`${styles.container} main_font`}>
    {step.name == "" ? <LoadingScreen></LoadingScreen> : <main className={`${styles.container} main_font`}>
      {question >= 0 ? (
        <>
          <h1 style={{fontSize:'2rem'}} className="main_font font-bold">{step.name.toUpperCase()}</h1>
          <p style={{marginBottom:'100px', marginTop:'10px'}} className="main_font">{step.questions[question].question}</p>
          <div className={styles.selection_box}>
            {step.questions[question].responses.map((response, index) => (
              <button disabled={disableButtons} className={correctAnswer == index ? styles.correct_answer : correctAnswer >= 0 && selectedAnswer == index ? styles.wrong_answer : selectedAnswer == index ? styles.selected_button : "NULL"} key={index}
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
                  className={`${styles.check_button} ${styles.continue_button}`}
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
                  className={styles.check_button}
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
          <button className={styles.done_button} onClick={() => goToCourse()}>
            Your score is {score} out of {step.questions.length}
          </button>
        </>
      )}
    </main>}
    </div>);
}
"use client";
import { CheckCircle, Circle, Stars } from "@mui/icons-material";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { IconButton, Step } from "@mui/material";
import styles from './course.module.css'
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

export default function Course({ params }: { params: { id: string } }) {
  const router = useRouter();

  const courseID = params.id;
  const [course, setCourse] = useState([]);
  const [curStep, setStep] = useState(0);
  const [user, setUser] = useState({ courseDetails : { "" : { q : 0, c : 0 } }})

  const [ratio, setRatio] = useState(0);
  const margins = [-70,70]

  const [showFinishScreen, setSFS] = useState(false)

  useEffect(() => {
    init()
  }, []);

  async function init() {
    await fetchUser()
  }

  async function fetchUser(){
    const fetchedCourse = await fetcher(`/api/fetchCourse?id=${courseID}`, undefined)
    setCourse(JSON.parse(fetchedCourse.content))

    if(getCookie("user")){
      setUser(JSON.parse(getCookie("user")!))
      if(JSON.parse(JSON.parse(getCookie("user")!).courseDetails)[courseID]){
        var courseJSON = JSON.parse(JSON.parse(getCookie("user")!).courseDetails)[courseID]
        setStep(courseJSON.step)

        console.log(courseJSON.step + "    " + JSON.parse(fetchedCourse.content).length)
        if(courseJSON.step >= JSON.parse(fetchedCourse.content).length) setSFS(true);
        
        var t = courseJSON.q
        var c = courseJSON.c
        setRatio(c/t)
      } 
      else {
        const newStep = await fetcher(`/api/updateCourse?uid=${JSON.parse(getCookie("user")!).id}&cid=${courseID}&q=0&c=0&step=-1`, undefined)
        document.cookie = `user=${JSON.stringify(newStep)}; path=/`
      }
    } else {
      router.push("/")
    }
  }

  async function goToStep(index: number) {
    if(index <= curStep){
        setCourse([])
        router.push(`/course/${courseID}/${index}`);
    }
  }

  return (
    <main className={`${styles.container} main_font`}>
        {showFinishScreen ? <FinishScreen rank={ratio < 0.5 ? "ROOKIE" : ratio < 0.75 ? "NOVICE" : ratio < 0.9 ? "EXPERT" : "CERTIFIED BADASS"}></FinishScreen> : course[0] ? <>
          <button className="absolute top-10 left-10 text-3xl" onClick={() => {router.push(`/`);}}>
              {"BACK"}
          </button>
          {course.map((step, index) => (
          <motion.div className={styles.step} key={`step_${index}`} style={{margin: 10, marginLeft: margins[(index % margins.length + margins.length) % margins.length]}}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
              }}>
              <button onClick={() => goToStep(index)} className={`${styles.island} ${index > curStep ? styles.undiscovered : index == curStep ? styles.current : styles.done}`}>
                <div>
                  {index+1}
                </div>
              </button>
          </motion.div>))}
        </> : <LoadingScreen></LoadingScreen>}
    </main>);
}
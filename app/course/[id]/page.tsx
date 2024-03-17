"use client";
import { CheckCircle, Circle, Stars } from "@mui/icons-material";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { IconButton, Step } from "@mui/material";
import styles from './course.module.css'
import LoadingScreen from "@/app/components/loading_screen";
import { motion } from "framer-motion";

const fetcher = (url: string, data: AxiosRequestConfig<any> | undefined) => {
  return axios.get(url, data).then(res => res.data);
};

export default function Course({ params }: { params: { id: string } }) {
  const router = useRouter();

  const courseID = params.id;
  const [course, setCourse] = useState([]);
  const [curStep, setStep] = useState(0);
  const margins = [-70,70]

  useEffect(() => {
    fetchCourseInit()
  }, []);

  async function fetchCourseInit(){
    const fetchedCourse = await fetcher(`/api/fetchCourse?id=${courseID}`, undefined)
    setCourse(JSON.parse(fetchedCourse.content))
    setStep(JSON.parse(fetchedCourse.curStep))

    if(JSON.parse(fetchedCourse.curStep) >= JSON.parse(fetchedCourse.content).length) router.push(`/`);
  }

  async function goToStep(index: number) {
    if(index <= curStep){
        setCourse([])
        router.push(`/course/${courseID}/${index}`);
    }
  }

  return (
    <main className={`${styles.container} main_font`}>
        {course[0] ? <>
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
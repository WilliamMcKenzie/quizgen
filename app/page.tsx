"use client";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import styles from './homepage.module.css'
import { motion } from 'framer-motion';
import SquareProgress from "./components/square_progress";
import LoadingOverlay from "./components/loading_overlay";

const fetcher = (url: string, data: AxiosRequestConfig<any> | undefined) => {
  return axios.get(url, data).then(res => res.data);
};

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
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
function setCookie(cname: string) {
  document.cookie = `id=${cname}; path=/`
}

export default function Home() {
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const [id, setID] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  var goneToCourse = false

  useEffect(() => {
    fetchUser()
  }, []);

  async function fetchUser(){
    if(getCookie("id")){
      setID("LOADING")
      const fetchUser = await fetcher(`/api/fetchUser?password=${password}&email=${email}`, undefined)

      if(fetchUser.id) {
        setID(fetchUser.id)
      } 
      else {
        setID("")
        window.alert("INVALID ERRORROROR SERVER ERROR: REASON: braincells <= 0")
      }
    }
  }
  async function goToCourse(course: string) {
    const createdCourse = await fetcher(`/api/uploadCourse?course=${course}`, undefined)
    router.push(`/course/${createdCourse.id}`);
  }

  async function handleClick() {
    setLoading(true)
    if(id != "" && subject.length < 50){
      const generatedCourse = await fetcher(`/api/generateCourse?prompt=${subject}`, undefined)

      setCourse(JSON.stringify(generatedCourse))
      goToCourse(JSON.stringify(generatedCourse))
    }
    else window.alert("TOO LONG YOU FOOL")
  }
  async function continueWithEmail() {
    if(password != "" && email != "") {
      var createUser
      setID("LOADING")

      try {
        createUser = await fetcher(`/api/createUser?password=${password}&email=${email}`, undefined)
      }
      catch (error) {
        await fetchUser()
        return
      }

      setID(createUser.id)
      setCookie(createUser.id)
    }
  }

  return (
    <div className={`min-h-screen mx-auto items-center justify-center flex flex-col main_font ${styles.blob_bg}`}>
      <h1 className="text-center mb-4 text-4xl font-bold">QUIZ GEN</h1>
      <h3 className="text-center mb-4 text-2xl">Test your knowledge on anything.</h3>
      {id == "LOADING" ? <LoadingOverlay></LoadingOverlay> : <></>}
      
      {//When signed in
      id != "" && id != "LOADING" ? <motion.div className="flex flex-col"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}>
        <div className="flex justify-center items-center mt-6">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a subject"
            className={`rounded border p-2 mr-2 text-black text-xl ${styles.submit_bar}`}
            disabled={loading}
          />
          <button
            className={`rounded border border-black dark:border-white p-2 text-xl ${styles.blob_button}`}
            onClick={handleClick}
            disabled={loading}
          >
            Create
          </button>
        </div>
        <div className="flex justify-center items-center mt-6 h-1">
            {loading ? <LinearProgress sx={{width: '100%'}}/> : <></>}
        </div>
      </motion.div>

      :
      
      //When signed out
      <motion.div className="flex justify-center items-center mt-6 flex-col"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}><div className="flex justify-center items-center mt-6">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`rounded border p-2 mr-2 text-black text-xl ${styles.submit_bar}`}
              disabled={loading}
            />
          </div>
        <div className="flex justify-center items-center mt-6">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className={`rounded border p-2 mr-2 text-black text-xl ${styles.submit_bar}`}
              disabled={loading}
            />
          </div>
        <button
          className={`rounded border border-black dark:border-white p-2 text-xl mt-6 ${styles.blob_button}`}
          onClick={continueWithEmail}
          disabled={loading}
        >
              Continue
        </button></motion.div>}
    </div>
  );
}
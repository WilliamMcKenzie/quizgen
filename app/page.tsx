"use client";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { IconButton, LinearProgress } from "@mui/material";
import styles from './modulestyles/homepage.module.css'
import { motion } from 'framer-motion';
import SquareProgress from "./components/square_progress";
import LoadingOverlay from "./components/loading_overlay";
import KUTE from 'kute.js'
import Footer from "./components/footer";
import { ArrowForward } from "@mui/icons-material";

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

  useEffect(() => {
    var tween1 = KUTE.to('#top1', { path: "#top2" }, {repeat: 999, duration: 3000, yoyo: true}).start();
    var tween2 = KUTE.to('#bot1', { path: "#bot2" }, {repeat: 999, duration: 3000, yoyo: true}).start();
    fetchUser()
  }, []);

  async function fetchUser() {
    // if (getCookie("email") && getCookie("password")) {
    //   setID("LOADING")
    //   const fetchUser = await fetcher(`/api/fetchUser?password=${getCookie("password")}&email=${getCookie("email")}`, undefined)

    //   if (fetchUser.id) {
    //     setID(fetchUser.id)
    //   }
    //   else {
    //     setID("")
    //     window.alert("INVALID ERRORROROR SERVER ERROR: REASON: braincells <= 0")
    //   }
    // }
  }
  async function goToCourse(course: string) {
    const createdCourse = await fetcher(`/api/uploadCourse?course=${course}`, undefined)
    router.push(`/course/${createdCourse.id}`);
  }

  async function handleClick() {
    setLoading(true)
    if (id != "" && subject.length < 50) {
      const generatedCourse1 = await fetcher(`/api/generateCourse1?prompt=${subject}`, undefined)
      const generatedCourse2 = await fetcher(`/api/generateCourse2?prompt=${JSON.stringify(generatedCourse1)}`, undefined)

      for(var step of generatedCourse2.content){
        generatedCourse1.content.push(step)
      }

      setCourse(JSON.stringify(generatedCourse1))
      goToCourse(JSON.stringify(generatedCourse1))
    }
    else window.alert("TOO LONG YOU FOOL")
  }
  async function continueWithEmail() {
    if (password != "" && email != "") {
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
      document.cookie = `email=${createUser.email}; path=/`
      document.cookie = `password=${createUser.password}; path=/`
    }
  }

  return (
    <div style={{overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh"}} className={`min-h-screen mx-auto items-center justify-center flex flex-col main_font`}>
      <h1 className="text-center mb-4 text-4xl font-bold" >QUIZ GEN</h1>
      <h3 className="text-center mb-4 text-xl">Test your knowledge on anything.</h3>
      <svg className={styles.svg_blend} id="visual" viewBox="0 0 900 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <g transform="translate(900, 600)">
          <path id="top1" d="M-270.4 0C-256 -20.7 -241.5 -41.4 -234.7 -62.9C-227.9 -84.4 -228.7 -106.6 -221.7 -128C-214.7 -149.4 -199.9 -169.9 -180.3 -180.3C-160.8 -190.7 -136.5 -190.9 -118.5 -205.2C-100.5 -219.6 -88.7 -248 -70 -261.2C-51.3 -274.4 -25.6 -272.4 0 -270.4L0 0Z" fill="#ff0066"></path>
        </g>
        <g transform="translate(0, 0)">
          <path id="bot1" d="M270.4 0C260 21.9 249.6 43.8 240.5 64.4C231.4 85 223.5 104.3 214.8 124C206 143.7 196.5 163.7 183.8 183.8C171.2 204 155.6 224.2 135.2 234.2C114.9 244.2 89.8 243.9 66.5 248.2C43.2 252.6 21.6 261.5 0 270.4L0 0Z" fill="#9900ff"></path>
        </g>
        <g style={{visibility: "hidden"}} transform="translate(900, 600)">
          <path id="top2" d="M-270.4 0C-263.1 -23.2 -255.7 -46.3 -243.4 -65.2C-231.1 -84.1 -213.8 -98.8 -204.4 -118C-194.9 -137.2 -193.2 -161.1 -183.8 -183.8C-174.4 -206.6 -157.3 -228.3 -135.2 -234.2C-113.1 -240.1 -86 -230.3 -62.6 -233.8C-39.3 -237.2 -19.6 -253.8 0 -270.4L0 0Z" fill="#ff0066"></path>
        </g>
        <g style={{visibility: "hidden"}} transform="translate(0, 0)">
          <path id="bot2" d="M270.4 0C259.7 21.6 248.9 43.1 243.4 65.2C237.9 87.3 237.6 110 231.2 133.5C224.9 157 212.5 181.4 191.2 191.2C169.9 201 139.7 196.2 118.5 205.2C97.3 214.2 85.3 237 67 250.2C48.8 263.3 24.4 266.9 0 270.4L0 0Z" fill="#9900ff"></path>
        </g>
      </svg>
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
            <IconButton aria-label="add an alarm" onClick={handleClick} disabled={loading}>
              <ArrowForward />
            </IconButton>
          </div>
          <div className="flex justify-center items-center mt-6 h-1">
            {loading ? <LinearProgress sx={{ width: '100%' }} /> : <></>}
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
              className={`rounded border border-black dark:border-white p-2 text-xl mt-6 ${styles.continue_button}`}
              onClick={continueWithEmail}
              disabled={loading}
            >
              CONTINUE
            </button></motion.div>}
    </div>
  );
}
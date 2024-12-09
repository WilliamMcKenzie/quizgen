"use client";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import LoadingOverlay from "./components/loading_overlay";
import KUTE from 'kute.js'
import { LinearProgress } from "@mui/material";

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

export default function Home() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDialogElement>(null);
  
  const [id, setID] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [progress, setProgress] = useState(0)

  const [codeError, setCodeError] = useState(false)
  const [code, setCode] = useState("")
  const [fetching, setFetching] = useState(false)

  const searchParams = new URLSearchParams(window.location.search)

  useEffect(() => {
    KUTE.to('#top1', { path: "#top2" }, {repeat: 999, duration: 3000, yoyo: true}).start();
    KUTE.to('#bot1', { path: "#bot2" }, {repeat: 999, duration: 3000, yoyo: true}).start();
    fetchUser(false)

    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 2.5));
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, []);

  async function fetchUser(login : Boolean) {
    var _email = email
    var _password = password

    if (!login && getCookie("email") && getCookie("password")) {
      _email = getCookie("email")!
      _password = getCookie("password")!
    }
    else if (!login) {
      return
    }

    setID("LOADING")
    const fetchUser = await fetcher(`/api/fetchUser?password=${_password}&email=${_email}`, undefined)

    if (fetchUser.id) {
      setID(fetchUser.id)

      if (searchParams.has("go")) {
        router.push(`/quiz/${searchParams.get("go")}`);
      }
    }
    else {
      setID("")
    }
  }

  async function goToQuiz(quiz: string) {
    const createdQuiz = await fetcher(`/api/uploadQuiz?quiz=${quiz}`, undefined)
    router.push(`/quiz/${createdQuiz.code}`);
  }

  async function handleClick() {
    setLoading(true)
    if (id != "" && subject.length < 50) {
      setProgress(0);
      const generatedQuiz = await fetcher(`/api/generateQuiz?prompt=${subject}`, undefined)
      setProgress((prevProgress) => (prevProgress >= 90 ? 98 : 90));

      var stack = generatedQuiz.split("0:")

      var quiz = ``
      for(var chunk of stack) {
        try {quiz += JSON.parse(`{"char":${chunk}`.trimEnd() + "}").char;}
        catch(error){
        }
      }
      quiz.replace(/\n/g, '')
      goToQuiz(quiz)
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
        await fetchUser(true)
        return
      }
      
      setID(createUser.id)
      document.cookie = `user=${JSON.stringify(createUser)}; path=/`
      document.cookie = `email=${createUser.email}; path=/`
      document.cookie = `password=${createUser.password}; path=/`

      if (searchParams.has("go")) {
        router.push(`/quiz/${searchParams.get("go")}`);
      }
    }
  }

  return (
    <div style={{overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh"}} className={`min-h-screen mx-auto items-center justify-center flex flex-col main_font`}>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box" style={{width: "40vh"}}>
          <h3 className="font-bold text-lg">Join</h3>
          { !codeError ?  <p className="py-4">Enter a 6 digit quiz code.</p> : <p className="py-4">Invalid code.</p>}
          <label className={"input input-bordered flex items-center gap-2 " + (codeError ? "input-error" : "")}>
            <input
              value={code}
              type="text" 
              spellCheck="false"
              list="autocompleteOff" 
              autoComplete="off"
              aria-autocomplete="none"
              onChange={(e) => {
                setCodeError(false)
                setCode(e.target.value.toUpperCase())
              }}
              placeholder="XXXXXX"
              disabled={fetching}
            />

            <button className="ml-auto" onClick={async () => {
              setFetching(true)
              const fetchedQuiz = await fetcher(`/api/fetchQuiz?id=${code}`, undefined)
              setFetching(false)
              if (fetchedQuiz) {
                router.push(`/quiz/${code.toUpperCase()}`);
              }
              else {
                setCodeError(true)
              }
            }} disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 opacity-70">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </label>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="absolute top-10 right-10">
        <button className="btn btn-ghost" onClick={
                () => {
                  if (modalRef.current) {
                    modalRef.current?.showModal()
                  }
                }
              }>
          Enter code
        </button>
        <button className="btn btn-ghost" onClick={
                () => {
                  router.push(`/quiz`);
                }
              }>
          Your quizzes
        </button>
      </div>
      <h1 className="text-center mb-4 text-4xl font-bold" >QUIZ GEN</h1>
      <h3 className="text-center mb-4 text-xl">Test your knowledge on anything.</h3>
      <svg className={"svg_blend"} id="visual" viewBox="0 0 900 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
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

      {
        id != "" && id != "LOADING" ? <motion.div className="flex flex-col"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
          }}>
          <div className="flex justify-center items-center mt-6">
          <label className="input input-bordered flex items-center gap-2">
            <input
              value={subject}
              type="text" 
              spellCheck="false"
              list="autocompleteOff" 
              autoComplete="off"
              aria-autocomplete="none"
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter a subject"
              disabled={loading}
            />

            <button onClick={handleClick} disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 opacity-70">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </label>
            
          </div>
          <div className="flex justify-center items-center mt-6 h-1">
            {loading ? <LinearProgress variant="determinate" value={progress} sx={{ width: '100%' }} /> : <></>}
          </div>
        </motion.div>

          :

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
                name="data_input_field_1"
                id="data_input_field_1"
                aria-autocomplete="none"
                list="autocompleteOff"
                type="email"
                spellCheck="false" 
                autoComplete="off"
                className={`input input-bordered w-full max-w-xs`}
                disabled={loading}
              />
            </div>
            <div className="flex justify-center items-center mt-6">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                name="data_input_field_2"
                id="data_input_field_2"
                type="password"
                list="autocompleteOff"
                aria-autocomplete="none"
                spellCheck="false" 
                autoComplete="off"
                className={`input input-bordered w-full max-w-xs`}
                disabled={loading}
              />
            </div>
            <button
              className={`btn btn-primary mt-6`}
              onClick={continueWithEmail}
              disabled={password == "" || email == "" ? true : false}
            >
              CONTINUE
            </button></motion.div>}
    </div>
  );
}
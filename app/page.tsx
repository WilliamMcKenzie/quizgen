"use client";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import LoadingOverlay from "./components/loading_overlay";
import KUTE from 'kute.js'
import { LinearProgress } from "@mui/material";
import Link from "next/link";

const fetcher = (url: string, data: AxiosRequestConfig<any> | undefined) => {
  return axios.get(url, data).then(res => res.data);
};

export default function Home() {
  const router = useRouter()
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState(5)
  const [steps, setSteps] = useState([ "Breeds of dogs", "", "" ])

  const [loading, setLoading] = useState(false)

  const codeRef = useRef<HTMLDialogElement>(null);
  const settingsRef = useRef<HTMLDialogElement>(null);
  
  const [id, setID] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [progress, setProgress] = useState(0)

  const [codeError, setCodeError] = useState(false)
  const [code, setCode] = useState("")
  const [fetching, setFetching] = useState(false)

  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : "")

  if (typeof window !== 'undefined') {
    window.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        if (id != "" && id != "LOADING") {
          queueQuiz()
        }
        else {
          standardLogin()
        }
      }
    })
  }

  useEffect(() => {
    KUTE.to('#top1', { path: "#top2" }, {repeat: 999, duration: 3000, yoyo: true}).start();
    KUTE.to('#bot1', { path: "#bot2" }, {repeat: 999, duration: 3000, yoyo: true}).start();
    autoLogin()

    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 2.5));
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, []);

  async function autoLogin() {
    const user = await fetchUser(localStorage.getItem("email")!, localStorage.getItem("password")!)
    localStorage.setItem("user", JSON.stringify(user))
  }


  async function standardLogin() {
    if (password != "" && email != "") {
      if (!email.includes("@") || email.length < 6) {
        window.alert("Invalid email!")
        return
      }

      var user
      setID("LOADING")

      try {
        user = await fetcher(`/api/createUser?password=${password}&email=${email}`, undefined)
        setID(user.id)
      }
      catch (error) {
        user = await fetchUser(email, password)

        if (!user) {
          window.alert("Email taken/wrong password")
          return
        }
      }
      
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("email", email)
      localStorage.setItem("password", password)
    }
  }
  
  async function fetchUser(email: string, password: string) {
    setID("LOADING")
    const user = await fetcher(`/api/fetchUser?password=${password}&email=${email}`, undefined)

    if (user.id) {
      setID(user.id)
    }
    else { 
      setID("")
    }

    if (searchParams.has("go") && user.id) {
      router.push(`/quiz/${searchParams.get("go")}`);
    }
    else {
      return user
    }
  }

  async function createQuiz(quiz: string) {
    try {
      if (JSON.parse(quiz).quiz_name == "INVALID_INPUTS") {
        setLoading(false)
        setFetching(false)
        return
      }
    }
    catch {
      setLoading(false)
      setFetching(false)
      return
    }

    const createdQuiz = await fetcher(`/api/uploadQuiz?quiz=${quiz}&author=${id}`, undefined)
    router.push(`/quiz/${createdQuiz.code}`);
  }

  async function queueQuiz(custom_params = false) {
    setLoading(true)

    if (id != "" && subject.length < 100) {
      setProgress(0);
      const param_string = custom_params ? `&customized=true&difficulty=${difficulty}&steps=${steps.map((step) => step != "" ? `${step}` : "auto")}` : ""
      const generatedQuiz = await fetcher(`/api/generateQuiz?prompt=${subject}` + param_string, undefined)
      setProgress((prevProgress) => (prevProgress >= 90 ? 98 : 90));

      var stack = generatedQuiz.split("0:")
      var quiz = ``
      for(var chunk of stack) {
        try {
          quiz += JSON.parse(`{"char":${chunk}`.trimEnd() + "}").char
        }
        catch {}
      }
      quiz.replace(/\n/g, '')
      createQuiz(quiz)
    }
    else window.alert("Prompt to long!")
  }

  return (
    <div style={{overflow: "hidden", maxWidth: "100vw", maxHeight: "100vh"}} className={`min-h-screen mx-auto items-center justify-center flex flex-col main_font`}>
      <dialog ref={codeRef} className="modal">
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
      <dialog ref={settingsRef} className="modal">
        <div className="modal-box" style={{width: "60vh"}}>
          <h3 className="font-bold text-xl mb-8">Advanced Mode</h3>
          <label className="mt-2 input input-bordered flex items-center gap-2">
            <p className="py-4">Subject:</p>
            <input
              value={subject}
              type="text" 
              spellCheck="false"
              list="autocompleteOff" 
              autoComplete="off"
              aria-autocomplete="none"
              onChange={(e) => {
                setSubject(e.target.value)
              }}
              placeholder="Dogs"
              disabled={fetching}
            />
          </label>
          <h3 className="font-bold text-lg mt-8 mb-8">Difficulty</h3>
          <input 
            value={difficulty}
            className="range range-primary"
            onChange={(e) => {
              setDifficulty(parseInt(e.target.value))
            }}
            type="range" 
            min={0} 
            max="10"/>
          <h3 className="font-bold text-lg mt-8 mb-8">Steps</h3>
          <table className="table">
            <tbody>
              {steps.map((_step, index) => {
                return <tr key={index}>
                  <th>{index + 1}</th>
                  <td className="flex"><input placeholder="auto" value={_step} className="input" onChange={(e) => {
                    var tempSteps = [...steps]
                    tempSteps[index] = e.target.value
                    setSteps(tempSteps)
                  }}></input>
                  {
                    index + 1 == steps.length && index < 4 ?

                    <button className="btn btn-square btn-ghost ml-auto" onClick={() => {
                      setSteps([...steps, ""])
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>

                    :

                    <button className="btn btn-square btn-ghost ml-auto" onClick={() => {
                      var tempSteps = [...steps]
                      tempSteps.splice(index, 1)
                      setSteps(tempSteps)
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  }
                  </td>
                </tr>
              })}
            </tbody>
          </table>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary mr-2" onClick={() => {
                  queueQuiz(true)
                }}>
                  Generate
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="absolute top-10 right-10">
        {/* <Link disabled={loading} className="btn btn-ghost mr-2" href={"https://buy.stripe.com/28o02e26BcSvbBK6ow"}>
            Upgrade to pro
        </Link> */}
        <button disabled={loading} className="btn btn-ghost mr-2" onClick={
                () => {
                  if (codeRef.current) {
                    codeRef.current?.showModal()
                  }
                }
              }>
          Enter code
        </button>
        <button disabled={loading} className="btn btn-ghost" onClick={
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
            {/* <button disabled={loading} onClick={
                () => {
                  if (settingsRef.current) {
                    settingsRef.current?.showModal()
                  }
                }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 opacity-70">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button> */}
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
            <button onClick={() => queueQuiz()} disabled={loading}>
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
              onClick={standardLogin}
              disabled={password == "" || email == "" ? true : false}
            >
              CONTINUE
            </button></motion.div>}
    </div>
  );
}
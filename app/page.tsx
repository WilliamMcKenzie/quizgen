"use client";
import axios, { AxiosRequestConfig } from "axios";
import Course from "./components/course.js";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import useLLM from "usellm";
import { LinearProgress } from "@mui/material";
import { ReactSVG } from "react-svg";

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const fetcher = (url: string, data: AxiosRequestConfig<any> | undefined) => {
  return axios.get(url, data).then(res => res.data);
};

export default function Home() {
  const llm = useLLM();
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  var goneToCourse = false

  async function goToCourse(course: string) {
    const createdCourse = await fetcher(`/api/uploadCourse?course=${course}`, undefined)
    router.push(`/course/${createdCourse.id}`);
  }

  async function handleClick() {
    setLoading(true)
    const response = await fetcher(`/api/generateCourse?prompt=${subject}`, undefined)
    setCourse(response.choices[0].message.content)
    goToCourse(response.choices[0].message.content)
  }
  return (
    <div className="min-h-screen mx-auto items-center justify-center flex flex-col main_font blob_bg">
      <h1 className="text-center mb-4 text-4xl font-bold">COURSE GEN</h1>
      <h3 className="text-center mb-4 text-2xl">Learn lightning fast, with cutting edge technology.</h3>
      <div className="flex flex-col">
        <div className="flex justify-center items-center mt-6">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a subject"
            className="rounded border p-2 mr-2 text-black submit_bar text-xl"
            disabled={loading}
          />
          <button
            className="rounded border border-black dark:border-white p-2 blob_button text-xl"
            onClick={handleClick}
            disabled={loading}
          >
            Submit
          </button>
        </div>
        <div className="flex justify-center items-center mt-6 h-1">
            {loading ? <LinearProgress sx={{width: '100%'}}/> : <></>}
        </div>
      </div>
    </div>
  );
}
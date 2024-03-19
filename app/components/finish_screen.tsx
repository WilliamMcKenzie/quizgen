import { motion } from "framer-motion";
import styles from '../modulestyles/finish_screen.module.css'
import { useEffect } from "react";
import KUTE from "kute.js";
import { useRouter } from "next/navigation";

export default function FinishScreen({ rank="" }) {
    const router = useRouter();
    useEffect(() => {
        var tween1 = KUTE.to('#blob1', { path: "#blob2" }, {repeat: 999, duration: 3000, yoyo: true}).start()
        var tween2 = KUTE.to('#top1', { path: "#top2" }, {repeat: 999, duration: 3000, yoyo: true}).start()
        var tween3 = KUTE.to('#bot1', { path: "#bot2" }, {repeat: 999, duration: 3000, yoyo: true}).start()
    }, []);
    return <div>
        <div className={styles.container} onClick={() => {router.push("/")}}>

        </div>
        <svg className={styles.svg_bg} id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" version="1.1">      
            <g transform="translate(439.8731295209006 311.98375110679586)">
                <path id="blob1" d="M139.5 -217.6C184.2 -188.3 226.3 -155.4 251.8 -111.5C277.2 -67.6 286.1 -12.6 278.5 40C271 92.7 247 142.9 210.4 178.9C173.9 214.8 124.8 236.5 75.4 246.2C25.9 256 -24 254 -74.5 243.7C-124.9 233.4 -175.8 214.9 -209.2 179.5C-242.5 144.1 -258.4 91.8 -260.6 40.7C-262.8 -10.3 -251.5 -60 -231.8 -107.1C-212.2 -154.2 -184.2 -198.6 -144.2 -230C-104.2 -261.4 -52.1 -279.7 -2.3 -276.1C47.4 -272.4 94.8 -246.8 139.5 -217.6" fill="none" stroke="#ffbb00" stroke-width="20"></path>
            </g>
            <g style={{visibility: "hidden"}} transform="translate(433.2182913653683 306.4287283296268)">
                <path id="blob2" d="M187.4 -182.8C233.4 -141.4 254.7 -70.7 242.6 -12.1C230.4 46.4 184.9 92.9 138.9 133.2C92.9 173.5 46.4 207.8 -6.2 214C-58.9 220.3 -117.9 198.5 -157.7 158.2C-197.5 117.9 -218.3 58.9 -210.9 7.4C-203.5 -44.2 -168.1 -88.4 -128.2 -129.7C-88.4 -171.1 -44.2 -209.5 13.3 -222.8C70.7 -236 141.4 -224.1 187.4 -182.8" fill="none" stroke="#ffbb00" stroke-width="20"></path>
            </g>
        </svg>
        <svg className={styles.svg_bg} id="visual" viewBox="0 0 900 600" preserveAspectRatio="none" width="900" height="600" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <g transform="translate(900, 0)">
                <path id="top1" d="M0 243.4C-27 221.6 -53.9 199.9 -75.8 182.9C-97.6 166 -114.3 153.7 -141.4 141.4C-168.6 129.1 -206.1 116.7 -224.8 93.1C-243.6 69.6 -243.5 34.8 -243.4 0L0 0Z" fill="#ff0066"></path>
            </g>
            <g transform="translate(0, 600)">
                <path id="bot1" d="M0 -243.4C28.6 -227.4 57.3 -211.3 81.1 -195.9C105 -180.4 124.1 -165.4 149.9 -149.9C175.7 -134.4 208.2 -118.2 224.8 -93.1C241.5 -68.1 242.5 -34 243.4 0L0 0Z" fill="#9900ff"></path>
            </g>
            <g style={{visibility: "hidden"}} transform="translate(900, 0)">
                <path id="top2" d="M0 243.4C-21.7 218.1 -43.4 192.9 -76.9 185.7C-110.4 178.5 -155.7 189.4 -172.1 172.1C-188.5 154.8 -175.9 109.2 -182.9 75.8C-190 42.4 -216.7 21.2 -243.4 0L0 0Z" fill="#ff0066"></path>
            </g>
            <g style={{visibility: "hidden"}} transform="translate(0, 600)">
                <path id="bot2" d="M0 -243.4C30.9 -239.5 61.9 -235.7 93.1 -224.8C124.4 -214 156 -196.3 169.7 -169.7C183.4 -143.2 179.2 -107.8 188.5 -78.1C197.8 -48.3 220.6 -24.2 243.4 0L0 0Z" fill="#9900ff"></path>
            </g>
        </svg>
        <motion.div className="flex flex-col"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
          }}>
            <h3 className="text-center mb-4 text-3xl">Your knowledge level is...</h3>
          </motion.div>
        <motion.div className="flex flex-col"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 2.5,
            delay: 2,
            ease: [0, 0.71, 0.2, 1.01]
          }}>
            <h1 className="text-center mb-4 text-5xl font-bold" >{rank}</h1>
          </motion.div>
    </div>;
}
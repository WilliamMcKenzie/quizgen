import { motion } from "framer-motion";
import SquareProgress from "./square_progress";

export default function LoadingOverlay() {
    return <div className="screen">
        <SquareProgress></SquareProgress>
    </div>;
}
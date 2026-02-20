import { motion } from "framer-motion";

const BackgroundDecorator = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Primary Floating Blob */}
            <motion.div
                animate={{
                    x: [0, 80, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"
            />

            {/* Secondary Floating Blob */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute bottom-[-5%] right-[-5%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]"
            />

            {/* Accent Blob */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, -120, 0],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]"
            />

            {/* Subtle Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
};

export default BackgroundDecorator;

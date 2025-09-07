import { useEffect, useState } from "react";

interface FlashSaleTimerProps {
    timerDuration: Date;
}

const FlashSaleTimer = ({ timerDuration }: FlashSaleTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = timerDuration.getTime() - now;

            if (distance > 0) {
                const hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft({ hours, minutes, seconds });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        updateTimer(); // Initial call
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [timerDuration]);

    return (
        <div className="rounded-lg bg-yellow-400 px-4 py-2 font-medium text-black">
            {timeLeft.hours.toString().padStart(2, "0")} hr :{" "}
            {timeLeft.minutes.toString().padStart(2, "0")} min :{" "}
            {timeLeft.seconds.toString().padStart(2, "0")} sec left
        </div>
    );
};

export default FlashSaleTimer;

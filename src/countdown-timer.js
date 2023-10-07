import {duration} from "./duration.js";

export const countdownTimer = (countFrom) => {
    let remaining = countFrom;
    const started = Date.now();
    const elapsedMs = () => Date.now() - started;
    return {
        get elapsedMs() {
            return elapsedMs();
        },
        get remaining() {
            return remaining;
        },
        get started() {
            return started;
        },
        tick() {
            remaining = remaining > 0 ? remaining - 1 : 0;
        },
        toString() {
            if (remaining <= 0) {
                return "0";
            }
            const elapsed = elapsedMs();
            const done = countFrom - remaining;
            if (done === 0) {
                return "?";
            }
            const remainMs = Math.round(elapsed * (remaining / done));
            return duration(remainMs);
        },
    };
};

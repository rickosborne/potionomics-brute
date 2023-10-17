const console = require("node:console");
const path = require("node:path");
const workerpool = require("workerpool");
const {existsSync} = require("../src/exists-sync.js");
const {exhaustiveTasks} = require("../src/exhaustive-tasks");

const exhaustive = async () => {
	const workerScript = path.resolve("src", "worker", "exhaustive-worker.js");
	if (!existsSync(workerScript)) {
		throw new Error(`Not found: ${workerScript}`);
	}
	const taskDatas = exhaustiveTasks();
	console.log(`Tasks: ${taskDatas.length}`);
	const pool = workerpool.pool(workerScript);
	setInterval(() => {
		const stats = pool.stats();
		console.log(`Pool: ${stats.activeTasks} active, ${stats.pendingTasks} queued`);
	}, 30_000);
	return Promise.all(taskDatas.map((taskData) => {
		return pool.exec('exhaustiveWorker', [taskData]);
	}));
};

exhaustive()
	.then(() => {
		console.log("Complete.");
	})
	.catch((error) => {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error(error);
		}
	});

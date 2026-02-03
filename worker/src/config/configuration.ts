export default () => ({
    backendUrl: process.env.BACKEND_URL || 'http://localhost:30001',
    workerToken: process.env.WORKER_TOKEN,
    headless: process.env.HEADLESS === 'true',
});

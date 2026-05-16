export const SERVICES = {
    workday: {
        baseUrl: process.env.WORKDAY_SERVICE_URL || 'http://localhost:3021',
    },
    core: {
        baseUrl:process.env.CORE_SERVICE_URL || 'http://localhost:3022'
    }
}
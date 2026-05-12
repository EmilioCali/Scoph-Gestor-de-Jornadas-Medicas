export function successResponse(reply, { message, data, statusCode = 200 }) {
    return reply.status(statusCode).send({
        success: true,
        message,
        data
    });
}
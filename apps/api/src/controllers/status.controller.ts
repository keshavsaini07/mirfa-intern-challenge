async function checkStatus(_req: any, reply: any) {
  return reply.send({ message: "api is live" });
}

export default { checkStatus };

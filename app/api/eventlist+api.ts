export async function GET(request: Request) {
  const response = await fetch("https://paceman.gg/api/get-events");
  const res = await response.json();
  return Response.json(res);
}

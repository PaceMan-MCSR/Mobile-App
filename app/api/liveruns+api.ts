export async function GET(request: Request) {
  const response = await fetch("https://paceman.gg/api/ars/liveruns");
  const res = await response.json();
  return Response.json(res);
}

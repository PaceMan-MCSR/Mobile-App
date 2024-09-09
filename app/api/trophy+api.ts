export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season");

  const response = await fetch(`https://paceman.gg/api/us/trophy?season=${season}`);
  const res = await response.json();
  return Response.json(res);
}

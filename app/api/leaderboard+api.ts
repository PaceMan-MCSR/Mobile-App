export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter");
  const removeDuplicates = searchParams.get("removeDuplicates");
  const date = searchParams.get("date");

  const response = await fetch(
    `https://paceman.gg/api/cs/leaderboard?filter=${filter}&removeDuplicates=${removeDuplicates}&date=${date}`
  );
  const res = await response.json();
  return Response.json(res.filter((run: any) => !run.isHidden && !run.isCheated));
}

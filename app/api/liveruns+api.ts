import { Pace } from "@/lib/types/Pace";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameVersion = searchParams.get("gameVersion") || undefined;
  const liveOnly = searchParams.get("liveOnly") === "true";

  const response = await fetch(`https://paceman.gg/api/ars/liveruns?gameVersion=${gameVersion}&liveOnly=${liveOnly}`);
  const res = await response.json();
  return Response.json(res.filter((run: Pace) => !run.isHidden && !run.isCheated));
}

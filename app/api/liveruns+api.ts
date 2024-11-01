import { Pace } from "@/lib/types/Pace";
import { apiToPace, paceSort } from "@/lib/utils/converters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameVersion = searchParams.get("gameVersion") || undefined;
  const liveOnly = searchParams.get("liveOnly") === "true";

  const response = await fetch(`https://paceman.gg/api/ars/liveruns?gameVersion=${gameVersion}&liveOnly=${liveOnly}`);
  const data = await response.json();
  const res = (await apiToPace(data)).sort(paceSort);
  return Response.json(res);
}

import { ReadonlyURLSearchParams } from "next/navigation";

export default function getValueFromParams(
  searchParams: ReadonlyURLSearchParams | null
) {
  let volunteerName = "Voluntária";

  if (!searchParams) {
    return {
      name: volunteerName,
      city: "",
      userId: "",
    };
  }

  return {
    name: searchParams.get("name") ?? volunteerName,
    city: searchParams.get("city") ?? "",
    userId: searchParams.get("userId") ?? "",
  };
}
